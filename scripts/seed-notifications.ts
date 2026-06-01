/**
 * Seed script: inserts 3 test notifications for every user in the DB.
 * Run with: npx tsx scripts/seed-notifications.ts
 */

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users, notifications } from '../lib/db/schema'
import { sql } from 'drizzle-orm'

async function main() {
  const client = postgres(process.env.DATABASE_URL!)
  const db = drizzle(client)

  // Ensure table exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "notifications" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "type" text NOT NULL,
      "title" text NOT NULL,
      "body" text NOT NULL,
      "link" text,
      "is_read" boolean DEFAULT false NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );
  `)

  const allUsers = await db.select({ id: users.id, name: users.name }).from(users)
  if (allUsers.length === 0) {
    console.log('No users found in DB.')
    await client.end()
    return
  }

  for (const user of allUsers) {
    await db.insert(notifications).values([
      {
        userId: user.id,
        type: 'task_claimed',
        title: '🎯 Task claimed',
        body: 'A developer just claimed your task "Build a landing page". Review their profile.',
        link: '/tasks',
        isRead: false,
      },
      {
        userId: user.id,
        type: 'submission_received',
        title: '📦 Submission received',
        body: 'You have a new submission waiting for review on "Fix API bug". Approve or request revisions.',
        link: '/submissions',
        isRead: false,
      },
      {
        userId: user.id,
        type: 'payment',
        title: '💸 Payment released',
        body: 'Escrow of ₹2,500 has been released to your wallet for completing "Dashboard UI".',
        link: '/earnings',
        isRead: true,
      },
    ])
    console.log(`✅ Seeded 3 notifications for: ${user.name} (${user.id})`)
  }

  await client.end()
  console.log('Done.')
}

main().catch(e => { console.error(e); process.exit(1) })
