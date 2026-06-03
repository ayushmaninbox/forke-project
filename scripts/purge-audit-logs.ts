/**
 * Purge script: deletes audit logs older than 7 days in the DB.
 * Run with: npx tsx scripts/purge-audit-logs.ts
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { adminAuditLog } from '../lib/db/schema'
import { sql } from 'drizzle-orm'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL env variable not found')
    process.exit(1)
  }

  const client = postgres(process.env.DATABASE_URL)
  const db = drizzle(client)

  console.log('🧹 Purging admin audit logs older than 7 days from the database...')
  try {
    // Self-healing: Ensure table and index exist before deleting
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "admin_audit_log" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "actor_id" uuid,
        "actor_name" text,
        "category" text NOT NULL DEFAULT 'admin',
        "action" text NOT NULL,
        "target" text,
        "metadata" jsonb,
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "admin_audit_log_created_at_idx" ON "admin_audit_log" ("created_at");
    `)

    await db.delete(adminAuditLog).where(sql`created_at < now() - interval '7 days'`)
    console.log('✅ Successfully purged older audit logs.')
  } catch (error) {
    console.error('❌ Failed to purge audit logs:', error)
  } finally {
    await client.end()
  }
  console.log('Done.')
}

main().catch(e => { console.error(e); process.exit(1) })
