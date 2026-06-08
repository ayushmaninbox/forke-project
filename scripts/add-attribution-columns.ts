import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'

// Adds first-touch marketing attribution columns.
// Idempotent + additive + nullable → existing rows are never disturbed.
//
// Usage:
//   npx tsx scripts/add-attribution-columns.ts                 # uses DATABASE_URL from .env.local
//   DATABASE_URL="postgresql://...prod..." npx tsx scripts/add-attribution-columns.ts   # explicit prod URL
async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('Error: DATABASE_URL env variable not found')
    process.exit(1)
  }

  const client = postgres(connectionString, { ssl: connectionString.includes('sslmode=require') ? 'require' : undefined })
  const db = drizzle(client)

  console.log('🚀 Adding attribution columns to users + subscribers...')
  try {
    await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "attribution" jsonb;`)
    await db.execute(sql`ALTER TABLE "subscribers" ADD COLUMN IF NOT EXISTS "attribution" jsonb;`)
    console.log('✅ Successfully added attribution columns.')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main().catch(e => { console.error(e); process.exit(1) })
