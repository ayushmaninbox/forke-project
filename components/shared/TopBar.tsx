import React from 'react'
import { auth } from '@/auth'
import Image from 'next/image'
import Link from 'next/link'
import { Wallet, Zap } from 'lucide-react'
import MobileMenuTrigger from '../dashboard/MobileMenuTrigger'
import { db } from '@/lib/db'
import { tasks } from '@/lib/db/schema'
import { eq, and, ne, sql } from 'drizzle-orm'
import NotificationBell from './NotificationBell'
import { getUnreadCount } from '@/app/(app)/notifications/actions'

interface TopBarProps {
  title: string
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
  let unreadNotificationsCount = 0

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
    }

    // Get live notifications unread count for bell initialization
    const notifRes = await getUnreadCount(user.id)
    unreadNotificationsCount = notifRes.count
  } catch (e) {
    console.error('Failed to query TopBar live statistics:', e)
  }

  return (
    <header className="h-14 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md px-5 md:px-8 flex items-center justify-between sticky top-0 z-30 select-none shrink-0">

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
            <span className="text-white font-medium tabular-nums font-mono">₹{financialMetric.toLocaleString()}</span>
            <span className="hidden md:inline">{isOwner ? 'in escrow' : 'claimed'}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="text-white font-medium tabular-nums font-mono">{activeCount}</span>
            <span className="hidden md:inline">active</span>
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-5 w-[1px] bg-[var(--color-border)]" />

        {/* Dynamic Live Polling Notification Bell */}
        <NotificationBell userId={user.id} initialUnreadCount={unreadNotificationsCount} />

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
