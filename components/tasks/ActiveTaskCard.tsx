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
    claimed: { label: 'CLAIMED', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    submitted: { label: 'SUBMITTED', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    approved: { label: 'APPROVED', color: 'bg-green-50 text-green-600 border-green-100' },
  }

  const config = statusConfig[task.status as keyof typeof statusConfig] || { label: task.status.toUpperCase(), color: 'bg-slate-100 text-slate-400 border-slate-200' }

  return (
    <Link 
      href={`/tasks/${task.id}`}
      className="block bg-white border-2 border-[var(--color-border)] rounded-2xl p-6 hover:border-accent hover:shadow-xl hover:shadow-accent/5 transition-all group"
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

        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  )
}
