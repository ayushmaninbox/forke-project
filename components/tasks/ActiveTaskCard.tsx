'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ActiveTaskCardProps {
  task: {
    id: string
    title: string
    budget: number
    status: string
  }
}

export default function ActiveTaskCard({ task }: ActiveTaskCardProps) {
  const statusConfig = {
    claimed: { label: 'CLAIMED', color: 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-[var(--color-border)]' },
    submitted: { label: 'SUBMITTED', color: 'bg-[var(--color-accent-light)] text-[var(--color-accent-text)] border-[var(--color-accent)]/20' },
    approved: { label: 'APPROVED', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  }

  const config = statusConfig[task.status as keyof typeof statusConfig] || { label: task.status.toUpperCase(), color: 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-[var(--color-border)]' }

  return (
    <Link 
      href={`/tasks/${task.id}`}
      className="block bg-white border border-[var(--color-border)] rounded-2xl p-6 hover:border-accent/40 hover:bg-accent/[0.02] transition-all group glass shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center gap-3">
            <span className={cn(
              "px-2 py-0.5 rounded text-[9px] font-bold border font-mono tracking-widest",
              config.color
            )}>
              {config.label}
            </span>
          </div>
          
          <h4 className="text-lg font-serif text-[var(--color-text-primary)] truncate group-hover:text-accent transition-colors">
            {task.title}
          </h4>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-accent font-mono font-bold">
               ₹ {Math.floor(task.budget / 100)}
            </div>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
          <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-white transition-colors" />
        </div>
      </div>
    </Link>
  )
}
