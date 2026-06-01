import React from 'react'
import Link from 'next/link'
import { auth } from '@/auth'
import NotificationBell from './NotificationBell'
import { getUnreadCount } from '@/app/(app)/notifications/actions'

interface TopBarProps {
  title: string
}

export default async function TopBar({ title }: TopBarProps) {
  const session = await auth()
  const user = session?.user as { id: string; name: string; role: 'developer' | 'owner'; image?: string } | undefined

  if (!user) return null

  let unreadNotificationsCount = 0

  try {
    const notifRes = await getUnreadCount(user.id)
    unreadNotificationsCount = notifRes.count
  } catch (e) {
    console.error('Failed to query notifications count:', e)
  }

  return (
    <header className="shrink-0 flex items-center justify-between gap-3 h-12 pl-16 pr-4 md:px-8">
      {/* Breadcrumb — orients you without a heavy bar; the page's own title sits below */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] min-w-0">
        <Link
          href="/dashboard"
          className="text-[var(--color-text-muted)] hover:text-white transition-colors shrink-0"
        >
          Dashboard
        </Link>
        <span className="text-white/20 shrink-0">/</span>
        <span className="text-white/90 font-medium truncate">{title}</span>
      </nav>

      <NotificationBell userId={user.id} initialUnreadCount={unreadNotificationsCount} />
    </header>
  )
}
