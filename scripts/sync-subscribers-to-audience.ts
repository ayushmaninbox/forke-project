/**
 * One-time sync: push every prod-DB subscriber into the Resend audience as a
 * contact, so the audience used for blog broadcasts matches the DB.
 *
 * Adds contacts only — sends NO email and uses NO daily quota. Idempotent:
 * re-adding an existing contact is a harmless no-op (409/422 treated as OK).
 *
 *   npx tsx scripts/sync-subscribers-to-audience.ts
 */

import * as dotenv from 'dotenv'
// Load .env.local first (has RESEND_API_KEY), then .env.production.local so its
// PROD_DATABASE_URL / RESEND_AUDIENCE_ID take precedence. dotenv does NOT
// overwrite already-set vars, so order matters: prod-specific file second only
// works because it defines keys .env.local doesn't. We read PROD_DATABASE_URL
// explicitly (not DATABASE_URL), so there's no local/prod DB ambiguity.
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env.production.local' })
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { subscribers } from '../lib/db/schema'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function clean(v: string | undefined) {
  return (v || '').replace(/^["']|["']$/g, '').trim()
}

async function main() {
  const dbUrl = process.env.PROD_DATABASE_URL
  const apiKey = clean(process.env.RESEND_API_KEY)
  const audienceId = clean(process.env.RESEND_AUDIENCE_ID)
  if (!dbUrl) throw new Error('PROD_DATABASE_URL not set')
  if (!apiKey) throw new Error('RESEND_API_KEY not set')
  if (!audienceId) throw new Error('RESEND_AUDIENCE_ID not set')

  console.log('═══ subscriber → audience sync ═══')
  console.log('DB host:    ', new URL(dbUrl).host)
  console.log('audience id:', audienceId)

  const client = postgres(dbUrl, { prepare: false, ssl: false, connect_timeout: 15 })
  const db = drizzle(client)

  // Load + dedup subscriber emails.
  const rows = await db.select({ email: subscribers.email }).from(subscribers)
  const emails: string[] = []
  const seen = new Set<string>()
  for (const r of rows) {
    const e = r.email?.trim()
    if (!e) continue
    const k = e.toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    emails.push(e)
  }
  console.log(`subscribers in DB: ${emails.length}`)

  // Current audience size before.
  const beforeRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  const beforeJson: any = await beforeRes.json()
  console.log(`audience contacts before: ${(beforeJson.data ?? []).length}`)

  // Add each (idempotent).
  let added = 0
  let existed = 0
  let failed = 0
  for (const email of emails) {
    try {
      const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ email, unsubscribed: false }),
      })
      if (res.ok) added++
      else if (res.status === 409 || res.status === 422) existed++
      else {
        failed++
        console.warn(`  ✗ ${email} -> ${res.status}: ${await res.text()}`)
      }
    } catch (err) {
      failed++
      console.warn(`  ✗ ${email} threw: ${(err as Error).message}`)
    }
    await sleep(120)
  }

  // Final audience size.
  const afterRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  const afterJson: any = await afterRes.json()
  const afterCount = (afterJson.data ?? []).length

  console.log('\n── result ──')
  console.log(`  newly added:        ${added}`)
  console.log(`  already existed:    ${existed}`)
  console.log(`  failed:             ${failed}`)
  console.log(`  audience now:       ${afterCount} contacts`)
  console.log(`  DB subscribers:     ${emails.length}`)
  console.log(`  ${afterCount >= emails.length ? '✓ audience covers all subscribers' : '⚠ audience still short — check failures above'}`)

  await client.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
