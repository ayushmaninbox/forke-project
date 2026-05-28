import postgres from 'postgres'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL environment variable is not defined.')
  process.exit(1)
}

async function run() {
  console.log('🔄 Connecting to database and running migration...')
  const sqlFile = path.join(__dirname, 'migrate_admins.sql')
  
  if (!fs.existsSync(sqlFile)) {
    console.error(`❌ Error: SQL file not found at ${sqlFile}`)
    process.exit(1)
  }

  const sqlContent = fs.readFileSync(sqlFile, 'utf8')
  const client = postgres(connectionString as string, { max: 1 })

  try {
    // Run the migration statements
    await client.unsafe(sqlContent)
    console.log('✅ Migration executed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()
