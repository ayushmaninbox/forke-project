/**
 * Clear script: deletes all notifications in the DB.
 * Run with: npx tsx scripts/clear-notifications.ts
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { notifications } from '../lib/db/schema'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL env variable not found')
    process.exit(1)
  }

  const client = postgres(process.env.DATABASE_URL)
  const db = drizzle(client)

  console.log('🧹 Clearing all notifications from the database...')
  try {
    const result = await db.delete(notifications)
    console.log('✅ Successfully cleared all notifications.')
  } catch (error) {
    console.error('❌ Failed to clear notifications:', error)
  } finally {
    await client.end()
  }
  console.log('Done.')
}

main().catch(e => { console.error(e); process.exit(1) })
