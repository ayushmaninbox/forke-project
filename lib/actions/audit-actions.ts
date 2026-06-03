'use server'

import { db } from '@/lib/db'
import { adminAuditLog, users, subscribers, supportEnquiries, tasks, submissions } from '@/lib/db/schema'
import { desc, eq, sql } from 'drizzle-orm'
import { getCurrentAdmin } from '@/lib/admin-actions'

export type ActivityCategory =
  | 'admin' | 'user' | 'owner' | 'db' | 'support' | 'task' | 'system' | 'error'

export interface ActivityEvent {
  id: string
  category: ActivityCategory
  action: string
  actor: string | null
  target: string | null
  createdAt: string // ISO
  ts: number
}

// Creates the audit table on demand (matches the project's runtime-migration pattern).
export async function ensureAuditLogTable() {
  try {
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
  } catch (e) {
    console.error('ensureAuditLogTable failed:', e)
  }
}

interface LogEntry {
  action: string
  category?: ActivityCategory
  target?: string | null
  metadata?: Record<string, unknown> | null
  actorName?: string | null
  actorId?: string | null
}

/** Records an admin action. Best-effort — never throws into the caller. */
export async function logAudit(entry: LogEntry) {
  try {
    await ensureAuditLogTable()
    let actorId = entry.actorId ?? null
    let actorName = entry.actorName ?? null
    if (!actorName) {
      const admin = await getCurrentAdmin().catch(() => null)
      if (admin) {
        actorId = admin.id
        actorName = admin.name
      }
    }
    await db.insert(adminAuditLog).values({
      actorId,
      actorName,
      category: entry.category ?? 'admin',
      action: entry.action,
      target: entry.target ?? null,
      metadata: entry.metadata ?? null,
    })
  } catch (e) {
    console.error('logAudit failed:', e)
  }
}

const ev = (
  id: string,
  category: ActivityCategory,
  action: string,
  actor: string | null,
  target: string | null,
  createdAt: Date,
): ActivityEvent => ({
  id,
  category,
  action,
  actor,
  target,
  createdAt: createdAt.toISOString(),
  ts: createdAt.getTime(),
})

/**
 * The unified activity feed: explicitly-logged admin actions merged with
 * derived system events (signups, subscribers, enquiries, tasks…) read straight
 * from existing tables — so it reflects "everything happening" without having to
 * instrument the rest of the app.
 */
export async function getActivityFeed(opts?: { category?: ActivityCategory | 'all'; limit?: number }) {
  const limit = opts?.limit ?? 120
  const events: ActivityEvent[] = []

  try {
    await ensureAuditLogTable()

    // 1) Logged admin actions
    const logged = await db.select().from(adminAuditLog).orderBy(desc(adminAuditLog.createdAt)).limit(100)
    for (const r of logged) {
      events.push(ev(`log-${r.id}`, (r.category as ActivityCategory) || 'admin', r.action, r.actorName, r.target, r.createdAt))
    }

    // 2) Derived system events from existing tables
    const [devs, subs, enqs, owners, tsk, subm] = await Promise.all([
      db.select({ id: users.id, name: users.name, username: users.username, createdAt: users.createdAt })
        .from(users).where(eq(users.role, 'developer')).orderBy(desc(users.createdAt)).limit(40),
      db.select().from(subscribers).orderBy(desc(subscribers.createdAt)).limit(40),
      db.select().from(supportEnquiries).orderBy(desc(supportEnquiries.createdAt)).limit(25),
      db.select({ id: users.id, name: users.name, isApproved: users.isApproved, createdAt: users.createdAt })
        .from(users).where(eq(users.role, 'owner')).orderBy(desc(users.createdAt)).limit(25),
      db.select({ id: tasks.id, title: tasks.title, status: tasks.status, createdAt: tasks.createdAt })
        .from(tasks).orderBy(desc(tasks.createdAt)).limit(25).catch(() => []),
      db.select({ id: submissions.id, status: submissions.status, createdAt: submissions.createdAt })
        .from(submissions).orderBy(desc(submissions.createdAt)).limit(25).catch(() => []),
    ])

    for (const d of devs) events.push(ev(`dev-${d.id}`, 'user', 'developer.signup', d.username || d.name, d.username ? `@${d.username}` : d.name, d.createdAt))
    for (const s of subs) events.push(ev(`sub-${s.id}`, 'system', 'subscriber.joined', null, s.email, s.createdAt))
    for (const e of enqs) events.push(ev(`enq-${e.id}`, 'support', 'support.enquiry', `${e.firstName} ${e.lastName}`, e.errorType ? `${e.contactEmail} · ${e.errorType}` : e.contactEmail, e.createdAt))
    for (const o of owners) events.push(ev(`own-${o.id}`, 'owner', o.isApproved ? 'owner.active' : 'owner.applied', o.name, o.name, o.createdAt))
    for (const t of tsk) events.push(ev(`task-${t.id}`, 'task', 'task.posted', null, t.title, t.createdAt))
    for (const s of subm) events.push(ev(`subm-${s.id}`, 'task', 'submission.created', null, `submission ${String(s.id).slice(0, 8)}`, s.createdAt))

    // 3) Merge, sort newest-first, filter, limit
    events.sort((a, b) => b.ts - a.ts)
    const filtered = !opts?.category || opts.category === 'all'
      ? events
      : events.filter((e) => e.category === opts.category)

    return { success: true, events: filtered.slice(0, limit) }
  } catch (e) {
    console.error('getActivityFeed failed:', e)
    return { success: false, events: [] as ActivityEvent[], error: 'Failed to load activity' }
  }
}
