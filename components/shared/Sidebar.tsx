'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
import { signOutAction } from '@/lib/auth-actions'
import { useDashboard } from '../dashboard/DashboardContext'

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
        <div className="p-3 border-t border-[var(--color-border)] space-y-3">
          <div className={cn("flex flex-col gap-3", isCollapsed ? "md:items-center" : "items-stretch")}>
            {/* User Info */}
            <div className={cn(
              "flex items-center gap-3 px-2 py-1 transition-all duration-300 overflow-hidden",
              isCollapsed ? "md:opacity-0 md:h-0 md:p-0" : "opacity-100 h-auto"
            )}>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{user.name}</p>
                <span className="inline-block mt-1 font-mono text-[10px] font-bold text-accent border border-accent rounded px-1.5 py-0.5">
                  LVL {user.level || 1}
                </span>
              </div>
            </div>

            {/* Actions */}
            <button 
              onClick={() => signOutAction()}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-md transition-colors",
                isCollapsed ? "md:justify-center" : "justify-start"
              )}
            >
              <LogOut className="w-5 h-5" />
              <span className={cn(
                "font-medium transition-opacity duration-300",
                isCollapsed ? "md:opacity-0 md:w-0" : "opacity-100"
              )}>
                Sign Out
              </span>
            </button>

            {/* Collapse Toggle (Desktop only) */}
            <button 
              onClick={toggleSidebar}
              className="hidden md:flex items-center justify-center p-2 text-muted hover:bg-[var(--color-bg-surface)] rounded-md transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
