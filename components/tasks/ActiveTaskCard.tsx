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
    claimed: { label: 'CLAIMED', color: 'bg-white/5 text-white/60 border-white/10' },
    submitted: { label: 'SUBMITTED', color: 'bg-accent/10 text-accent border-accent/20' },
    approved: { label: 'APPROVED', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  }

  const config = statusConfig[task.status as keyof typeof statusConfig] || { label: task.status.toUpperCase(), color: 'bg-white/5 text-white/40 border-white/10' }

  return (
    <Link 
      href={`/tasks/${task.id}`}
      className="block bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-accent/40 hover:bg-accent/[0.02] transition-all group glass"
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
          
          <h4 className="text-lg font-serif text-white truncate group-hover:text-accent transition-colors">
            {task.title}
          </h4>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-accent font-mono font-bold">
               ₹ {Math.floor(task.budget / 100)}
            </div>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
          <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white" />
        </div>
      </div>
    </Link>
  )
}
