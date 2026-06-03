import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import postgres from 'postgres'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL env variable not found')
    process.exit(1)
  }

  const client = postgres(process.env.DATABASE_URL)
  console.log('🔍 Inspecting drizzle.__drizzle_migrations table...')
  try {
    const columns = await client`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'drizzle' AND table_name = '__drizzle_migrations'
    `
    console.log('Columns:', columns)

    const rows = await client`
      SELECT * FROM "drizzle"."__drizzle_migrations"
    `
    console.log('Rows:', rows)
  } catch (error) {
    console.error('❌ Failed to inspect __drizzle_migrations:', error)
  } finally {
    await client.end()
  }
}

main().catch(e => { console.error(e); process.exit(1) })
