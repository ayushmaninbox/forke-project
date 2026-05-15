'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  PlusCircle,
  Search, 
  FileCheck, 
  Wallet, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { signOut } from 'next-auth/react'
import { useDashboard } from '@/components/dashboard/DashboardContext'
import { XpBar } from '@/components/ui/XpBar'
import { getLevelTitle } from '@/lib/utils/xp'

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Post a Task', href: '/post-task', icon: PlusCircle },
  { label: 'Browse Tasks', href: '/tasks', icon: Search },
  { label: 'My Submissions', href: '/submissions', icon: FileCheck },
  { label: 'Earnings', href: '/earnings', icon: Wallet },
  { label: 'Profile', href: '/profile', icon: User },
]

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    level?: number
    xp?: number
    currentStreak?: number
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const { isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed } = useDashboard()

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <>
      {/* Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-[var(--color-border)] transition-all duration-300 flex flex-col shadow-xl md:shadow-none",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Top: Logo & Mobile Close */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)]">
          <Link href="/dashboard" className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
            <span className="font-serif text-2xl text-[var(--color-text-primary)]">
              F<span className={cn("transition-opacity duration-300", isCollapsed ? "opacity-0" : "opacity-100")}>ork<span className="text-accent">e</span></span>
            </span>
          </Link>
          <button 
            className="md:hidden p-1 text-muted hover:text-[var(--color-text-primary)]"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Navigation */}
        <nav className="flex-grow py-6 px-3 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all group relative overflow-hidden",
                  isActive 
                    ? "bg-accent-light text-accent-text border-l-4 border-accent pl-2" 
                    : "text-muted hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)] pl-3",
                  isCollapsed ? "md:justify-center" : "justify-start"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-accent" : "text-muted group-hover:text-accent transition-colors")} />
                <span className={cn(
                  "font-medium transition-opacity duration-300",
                  isCollapsed ? "md:opacity-0 md:w-0" : "opacity-100"
                )}>
                  {link.label}
                </span>
                
                {/* Desktop Tooltip when collapsed */}
                {isCollapsed && (
                  <div className="hidden md:block absolute left-14 bg-[var(--color-text-primary)] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {link.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: User Card & Toggle */}
        <div className="p-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-2 min-h-[32px]">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-accent-light flex items-center justify-center border border-accent/10">
              {user.image ? (
                <Image src={user.image} alt={user.name || ''} width={32} height={32} />
              ) : (
                <span className="text-xs font-mono text-accent font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
          
            {/* Name + level (only show when expanded) */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                <p className="text-sm font-bold text-[var(--color-text-primary)] truncate leading-none mb-1">
                  {user.name?.split(' ')[0]}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent text-white font-bold leading-none">
                    LVL {user.level}
                  </span>
                  <span className="text-[10px] text-muted truncate font-medium uppercase tracking-tight">
                    {getLevelTitle(user.level || 1)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* XP bar — only show in expanded sidebar */}
          {!isCollapsed && (
            <div className="mb-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
              <XpBar totalXp={user.xp ?? 0} compact />
            </div>
          )}
          
          {/* Streak badge — show if streak > 1 */}
          {!isCollapsed && (user.currentStreak ?? 0) > 1 && (
            <div className="flex items-center justify-between mb-4 px-1 animate-in fade-in duration-700 delay-300">
              <span className="text-[10px] text-muted font-bold uppercase tracking-tighter">
                {user.currentStreak} day streak
              </span>
              {/* Flame dots — one per milestone hit */}
              <div className="flex gap-1">
                {[2, 5, 7, 14, 30].map((m) => (
                  <div
                    key={m}
                    className={cn(
                      'w-1.5 h-1.5 rounded-full ring-1 ring-offset-0',
                      (user.currentStreak ?? 0) >= m
                        ? 'bg-accent ring-accent/30'
                        : 'bg-border ring-transparent'
                    )}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className={cn(
                "flex items-center gap-3 px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-red-500 transition-colors",
                isCollapsed ? "justify-center w-full" : "justify-start"
              )}
            >
              <LogOut className="w-3.5 h-3.5" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>

            {/* Collapse Toggle (Desktop only) */}
            <button 
              onClick={toggleSidebar}
              className="hidden md:flex items-center justify-center p-1.5 text-muted hover:bg-[var(--color-bg-surface)] rounded-md transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
