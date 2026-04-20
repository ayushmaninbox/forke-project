'use client'

import { Menu } from 'lucide-react'
import { useDashboard } from './DashboardContext'

export default function MobileMenuTrigger() {
  const { setIsMobileOpen } = useDashboard()

  return (
    <button 
      className="md:hidden p-2 -ml-2 text-muted hover:text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-surface)] rounded-md"
      onClick={() => setIsMobileOpen(true)}
    >
      <Menu className="w-6 h-6" />
    </button>
  )
}
