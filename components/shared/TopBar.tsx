import { auth } from '@/auth'
import Image from 'next/image'
import Link from 'next/link'
import { Bell, Wallet, Zap } from 'lucide-react'
import MobileMenuTrigger from '../dashboard/MobileMenuTrigger'
import { db } from '@/lib/db'
import { tasks } from '@/lib/db/schema'
import { eq, and, ne, sql } from 'drizzle-orm'

interface TopBarProps {
  title: string
}

function formatRelativeTime(value: Date | null | undefined) {
  if (!value) return 'just now'
  const now = Date.now()
  const diffMs = now - new Date(value).getTime()
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))}m ago`
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`
  return `${Math.floor(diffMs / day)}d ago`
}

export default async function TopBar({ title }: TopBarProps) {
  const session = await auth()
  const user = session?.user as { id: string; name: string; role: 'developer' | 'owner'; image?: string } | undefined

  if (!user) return null

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
    : '?'

  const isOwner = user.role === 'owner'

  // Fetch real-time metrics for TopBar
  let activeCount = 0
  let financialMetric = 0
  let actionRequiredCount = 0
  let liveNotifications: Array<{
    id: string
    title: string
    status: string
    createdAt: Date | null
    href: string
  }> = []

  try {
    if (isOwner) {
      // Owners: Get active tasks count and total active budget (escrowed)
      const stats = await db
        .select({
          count: sql<number>`count(*)::int`,
          totalBudget: sql<number>`sum(${tasks.budget})::int`,
        })
        .from(tasks)
        .where(and(
          eq(tasks.clientId, user.id),
          ne(tasks.status, 'approved')
        ))
        .then(rows => rows[0] || { count: 0, totalBudget: 0 })

      activeCount = stats.count || 0
      financialMetric = stats.totalBudget ? Math.floor(stats.totalBudget / 100) : 0

      // Owners: Pending reviews count
      actionRequiredCount = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(tasks)
        .where(and(
          eq(tasks.clientId, user.id),
          eq(tasks.status, 'submitted')
        ))
        .then(rows => rows[0]?.count || 0)

      liveNotifications = await db
        .select({
          id: tasks.id,
          title: tasks.title,
          status: tasks.status,
          createdAt: tasks.createdAt,
          href: sql<string>`('/submissions')`,
        })
        .from(tasks)
        .where(and(
          eq(tasks.clientId, user.id),
          ne(tasks.status, 'open')
        ))
        .orderBy(sql`${tasks.createdAt} desc`)
        .limit(6)

    } else {
      // Developers: Get claimed active tasks and potential earnings
      const stats = await db
        .select({
          count: sql<number>`count(*)::int`,
          potentialEarnings: sql<number>`sum(${tasks.budget})::int`,
        })
        .from(tasks)
        .where(and(
          eq(tasks.claimantId, user.id),
          ne(tasks.status, 'approved')
        ))
        .then(rows => rows[0] || { count: 0, potentialEarnings: 0 })

      activeCount = stats.count || 0
      financialMetric = stats.potentialEarnings ? Math.floor(stats.potentialEarnings / 100) : 0

      // Developers: Pending approval count
      actionRequiredCount = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(tasks)
        .where(and(
          eq(tasks.claimantId, user.id),
          eq(tasks.status, 'submitted')
        ))
        .then(rows => rows[0]?.count || 0)

      liveNotifications = await db
        .select({
          id: tasks.id,
          title: tasks.title,
          status: tasks.status,
          createdAt: tasks.createdAt,
          href: sql<string>`('/tasks/' || ${tasks.id}::text)`,
        })
        .from(tasks)
        .where(and(
          eq(tasks.claimantId, user.id),
          ne(tasks.status, 'open')
        ))
        .orderBy(sql`${tasks.createdAt} desc`)
        .limit(6)
    }
  } catch (e) {
    console.error('Failed to query TopBar live statistics:', e)
  }

  return (
    <header className="h-14 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md px-5 md:px-8 flex items-center justify-between sticky top-0 z-30 select-none">

      {/* Left Title & Mobile Menu */}
      <div className="flex items-center gap-3">
        <MobileMenuTrigger />
        <h1 className="text-[15px] font-semibold text-white tracking-tight leading-none">{title}</h1>
      </div>

      {/* Right Stats & Profile */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* Live Stats (Financials & Active) */}
        <div className="hidden sm:flex items-center gap-4 text-[13px]">
          <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
            <Wallet className="w-3.5 h-3.5 text-accent" />
            <span className="text-white font-medium tabular-nums">₹{financialMetric.toLocaleString()}</span>
            <span className="hidden md:inline">{isOwner ? 'in escrow' : 'claimed'}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="text-white font-medium tabular-nums">{activeCount}</span>
            <span className="hidden md:inline">active</span>
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-5 w-[1px] bg-[var(--color-border)]" />

        {/* Notification Bell */}
        <details className="relative group">
          <summary className="list-none text-[var(--color-text-muted)] hover:text-white transition-colors relative p-1.5 rounded-lg hover:bg-white/[0.04] cursor-pointer">
            <Bell className="w-[18px] h-[18px]" />
            {actionRequiredCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-ping" />
            )}
            {actionRequiredCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            )}
          </summary>
          <div className="absolute right-0 mt-2 w-[320px] rounded-2xl border border-white/[0.06] bg-[#0b0b0e] shadow-2xl p-3 z-40">
            <div className="flex items-center justify-between px-2 py-1 border-b border-white/[0.05] mb-2">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/55 font-semibold">Notifications</p>
              <p className="text-[10px] text-accent font-semibold">{actionRequiredCount} pending</p>
            </div>
            <div className="max-h-72 overflow-auto space-y-1">
              {liveNotifications.length === 0 ? (
                <p className="text-xs text-white/45 px-2 py-3">No recent task updates.</p>
              ) : (
                liveNotifications.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="block rounded-xl px-2.5 py-2 hover:bg-white/[0.03] transition-colors"
                  >
                    <p className="text-xs text-white truncate">{item.title}</p>
                    <p className="text-[10px] text-white/45 mt-0.5 capitalize">
                      {item.status} · {formatRelativeTime(item.createdAt)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </details>
        {/* User Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--color-border)] bg-accent/10 flex items-center justify-center shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              fill
              className="object-cover select-none pointer-events-none"
              draggable={false}
            />
          ) : (
            <span className="text-accent font-semibold text-xs uppercase">{initials}</span>
          )}
        </div>
      </div>
    </header>
  )
}
