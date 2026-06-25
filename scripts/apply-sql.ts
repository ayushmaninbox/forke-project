// Generic, idempotent SQL applier. Reads DATABASE_URL straight from process.env —
// it does NOT load any .env file itself, so it never clobbers an env that a wrapper
// (e.g. dotenvx) injected. This is the fix for the earlier bug where a hardcoded
// dotenv.config({ path: '.env.local' }) overrode the prod URL back to local.
//
// Usage (the wrapper supplies DATABASE_URL):
//   npx @dotenvx/dotenvx run -f .env.production.local -- \
//     npx tsx scripts/apply-sql.ts drizzle/prod-apply-analytics.sql
import postgres from 'postgres'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const file = process.argv[2]
if (!file) {
  console.error('Usage: tsx scripts/apply-sql.ts <path-to-sql>')
  process.exit(1)
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in process.env (did the wrapper inject it?)')
}

// Show which host we're about to touch, with credentials masked, so it's impossible
// to run against the wrong DB without seeing it first.
const masked = connectionString.replace(/\/\/[^@]*@/, '//***:***@')
console.log('Target DB:', masked.slice(0, 90))

const sql = postgres(connectionString, { max: 1 })

async function main() {
  const ddl = readFileSync(resolve(process.cwd(), file), 'utf8')
  console.log(`Applying ${file} ...`)
  await sql.unsafe(ddl)
  console.log('Done.')
  await sql.end()
  process.exit(0)
}

main().catch((err) => {
  console.error('Apply failed:', err)
  process.exit(1)
})
