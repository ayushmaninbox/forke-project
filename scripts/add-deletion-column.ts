import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL env variable not found')
    process.exit(1)
  }

  const client = postgres(process.env.DATABASE_URL)
  const db = drizzle(client)

  console.log('🚀 Running migration to add deletion_scheduled_at to users table on AWS DB...')
  try {
    await db.execute(sql`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deletion_scheduled_at" timestamp;
    `)
    console.log('✅ Successfully added deletion_scheduled_at column.')
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await client.end()
  }
}

main().catch(e => { console.error(e); process.exit(1) })
