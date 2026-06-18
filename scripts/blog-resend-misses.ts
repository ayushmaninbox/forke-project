/**
 * Re-send a blog "published" email to subscribers who MISSED it the first time,
 * without duplicating to those who already received it.
 *
 * Why this exists: the first broadcast of "Why we built Forke" hit Resend's
 * 2 req/sec rate limit and silently dropped ~half the recipients (54/106 sent).
 * The fixed broadcast loop (lib/email.ts) now paces + retries, but the already-
 * sent recipients aren't recorded anywhere, so a naive re-run would double-send.
 *
 * Phases:
 *   1. Ensure blog_email_sends table exists (idempotent).
 *   2. Page Resend /emails, collect addresses already SENT for this subject
 *      (last_event != failed/bounced), and backfill them into blog_email_sends.
 *   3. misses = subscribers − already-sent.
 *   4. Dry-run prints the plan. With --live, re-send to misses (paced + retry)
 *      and record each into blog_email_sends.
 *
 * Target DB: PROD (.env.production.local PROD_DATABASE_URL). Resend key from env.
 *
 *   Dry run:  npx tsx scripts/blog-resend-misses.ts --slug why-we-built-forke
 *   Live:     npx tsx scripts/blog-resend-misses.ts --slug why-we-built-forke --live
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.production.local' })
dotenv.config({ path: '.env.local' })
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sql, eq } from 'drizzle-orm'
import { blogs, subscribers, blogEmailSends } from '../lib/db/schema'
import { buildBlogEmail } from '../lib/email'

const LIVE = process.argv.includes('--live')
const slugArg = (() => {
  const i = process.argv.indexOf('--slug')
  return i >= 0 ? process.argv[i + 1] : 'why-we-built-forke'
})()

const RESEND_KEY = process.env.RESEND_API_KEY!
const FROM = 'Forke Blog <blog@forke.space>'
const MIN_INTERVAL_MS = 600 // < 2 req/sec
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function subjectFor(title: string) {
  return `New on the Forke blog: ${title}`
}

/** Page Resend /emails and return addresses sent for `subject` (not failed). */
async function fetchAlreadySent(subject: string): Promise<Set<string>> {
  const sentSet = new Set<string>()
  let cursor: string | undefined
  let pages = 0
  while (pages < 50) {
    pages++
    const u = new URL('https://api.resend.com/emails')
    u.searchParams.set('limit', '100')
    if (cursor) u.searchParams.set('after', cursor)
    const res = await fetch(u, { headers: { Authorization: `Bearer ${RESEND_KEY}` } })
    if (!res.ok) {
      console.error('Resend /emails error', res.status, await res.text())
      break
    }
    const json: any = await res.json()
    const data: any[] = json.data ?? []
    for (const e of data) {
      if (e.subject !== subject) continue
      const failed = ['bounced', 'failed', 'complained'].includes(e.last_event)
      if (failed) continue
      for (const addr of e.to ?? []) sentSet.add(String(addr).toLowerCase())
    }
    if (!json.has_more || data.length === 0) break
    cursor = data[data.length - 1]?.id
    if (!cursor) break
  }
  return sentSet
}

async function sendOne(to: string, subject: string, html: string): Promise<boolean> {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_KEY}` },
        body: JSON.stringify({ from: FROM, to, reply_to: 'support@forke.space', subject, html }),
      })
      if (res.ok) return true
      const retryable = res.status === 429 || res.status >= 500
      console.error(`  send ${to} -> ${res.status}`, retryable ? '(retrying)' : '')
      if (!retryable || attempt === 4) return false
      const ra = res.headers.get('retry-after')
      await sleep(ra ? Number(ra) * 1000 : Math.min(8000, 500 * 2 ** (attempt - 1)))
    } catch (err) {
      console.error(`  send ${to} threw`, (err as Error).message)
      if (attempt === 4) return false
      await sleep(500 * 2 ** (attempt - 1))
    }
  }
  return false
}

async function main() {
  const url = process.env.PROD_DATABASE_URL
  if (!url) throw new Error('PROD_DATABASE_URL not set')
  if (!RESEND_KEY) throw new Error('RESEND_API_KEY not set')
  console.log('═══ blog re-send ═══')
  console.log('mode:    ', LIVE ? '🔴 LIVE (will send)' : '🟡 DRY RUN')
  console.log('DB host: ', new URL(url).host)
  console.log('slug:    ', slugArg)

  const client = postgres(url, { prepare: false, ssl: false, connect_timeout: 15 })
  const db = drizzle(client)

  // Phase 1 — ensure table exists.
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "blog_email_sends" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "blog_id" uuid NOT NULL REFERENCES "blogs"("id") ON DELETE CASCADE,
      "email" text NOT NULL,
      "sent_at" timestamp DEFAULT now() NOT NULL
    )`)
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "blog_email_sends_blog_email_uq"
    ON "blog_email_sends" ("blog_id","email")`)

  // Load the blog.
  const [blog] = await db.select().from(blogs).where(eq(blogs.slug, slugArg)).limit(1)
  if (!blog) throw new Error(`No blog with slug "${slugArg}"`)
  const subject = subjectFor(blog.title)
  console.log('blog:    ', blog.title, `(${blog.status})`)
  console.log('subject: ', subject)

  // Phase 2 — collect already-sent from Resend + backfill log.
  console.log('\n• Fetching delivered list from Resend…')
  const alreadySent = await fetchAlreadySent(subject)
  console.log(`  Resend shows ${alreadySent.size} address(es) already sent.`)

  for (const email of alreadySent) {
    await db.insert(blogEmailSends).values({ blogId: blog.id, email }).onConflictDoNothing()
  }
  const logged = await db
    .select({ email: blogEmailSends.email })
    .from(blogEmailSends)
    .where(eq(blogEmailSends.blogId, blog.id))
  const loggedSet = new Set(logged.map((r) => r.email.toLowerCase()))
  console.log(`  sent-log now has ${loggedSet.size} recorded recipient(s).`)

  // Phase 3 — compute misses.
  const subs = await db.select({ email: subscribers.email }).from(subscribers)
  const allSubs: string[] = []
  const seen = new Set<string>()
  for (const r of subs) {
    const e = r.email?.trim()
    if (!e) continue
    const k = e.toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    allSubs.push(e)
  }
  const misses = allSubs.filter((e) => !loggedSet.has(e.toLowerCase()))

  console.log('\n── plan ──')
  console.log('  subscribers:     ', allSubs.length)
  console.log('  already sent:    ', loggedSet.size)
  console.log('  to re-send (miss):', misses.length)
  if (misses.length <= 60) console.log('  misses:', misses.join(', '))

  if (!LIVE) {
    console.log('\n🟡 Dry run — no emails sent. Re-run with --live to send to the misses above.')
    await client.end()
    return
  }

  // Phase 4 — send to misses (paced + retry), record each.
  const html = buildBlogEmail({
    title: blog.title,
    excerpt: blog.excerpt,
    coverImage: blog.coverImage,
    authorName: blog.authorName,
    readingMinutes: blog.readingMinutes,
    publishedAt: blog.publishedAt,
    url: `https://www.forke.space/blogs/${blog.slug}`,
  })

  console.log(`\n🔴 Sending to ${misses.length} recipient(s)…`)
  let sent = 0
  const failed: string[] = []
  for (const email of misses) {
    const t0 = Date.now()
    const ok = await sendOne(email, subject, html)
    if (ok) {
      sent++
      await db.insert(blogEmailSends).values({ blogId: blog.id, email }).onConflictDoNothing()
      console.log(`  ✓ ${email}`)
    } else {
      failed.push(email)
      console.log(`  ✗ ${email}`)
    }
    const dt = Date.now() - t0
    if (dt < MIN_INTERVAL_MS) await sleep(MIN_INTERVAL_MS - dt)
  }

  console.log(`\n── result ──`)
  console.log('  sent:  ', sent)
  console.log('  failed:', failed.length, failed.length ? `(${failed.join(', ')})` : '')
  await client.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
