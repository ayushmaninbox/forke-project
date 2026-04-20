'use client'

import React from 'react'
import Link from 'next/link'
import { getRequiredLevel } from '@/lib/utils/tasks'
import { Lock, Clock, User, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface TaskCardProps {
  task: {
    id: string
    title: string
    budget: number
    skillTags: string[] | null
    createdAt: Date
  }
  clientName: string
  userLevel: number
}

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + 'y ago'
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + 'mo ago'
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + 'd ago'
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + 'h ago'
  interval = seconds / 60
  return Math.floor(interval) + 'm ago'
}

export default function TaskCard({ task, clientName, userLevel }: TaskCardProps) {
  const requiredLevel = getRequiredLevel(task.budget)
  const isLocked = userLevel < requiredLevel
  const budgetInRupees = Math.floor(task.budget / 100)

  return (
    <div className="group bg-white border border-[var(--color-border)] rounded-xl p-5 transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/5 flex flex-col h-full">
      <div className="flex justify-between items-start gap-4 mb-3">
        <h3 className="font-serif text-lg text-[var(--color-text-primary)] line-clamp-2 leading-tight flex-grow group-hover:text-amber-900 transition-colors">
          {task.title}
        </h3>
        <div className="font-mono text-lg font-bold text-accent shadow-sm px-2 bg-accent/5 rounded">
          ₹{budgetInRupees}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {task.skillTags?.map((tag) => (
          <span 
            key={tag} 
            className="px-2 py-0.5 bg-accent-light text-accent text-[9px] font-bold rounded uppercase tracking-wider font-mono border border-accent/10"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between text-[10px] text-muted font-medium border-t border-[var(--color-border)] pt-4">
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-accent/60" />
            <span>by <span className="text-[var(--color-text-primary)] font-bold">{clientName}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>{timeAgo(task.createdAt)}</span>
          </div>
        </div>

        <Link 
          href={`/tasks/${task.id}`}
          className={cn(
            "flex items-center justify-center gap-2 w-full h-10 rounded-lg text-xs font-bold transition-all",
            isLocked 
              ? "bg-[var(--color-bg-surface)] text-muted cursor-not-allowed border border-[var(--color-border)]"
              : "bg-[var(--color-text-primary)] text-white hover:bg-accent active:translate-y-0.5"
          )}
        >
          {isLocked ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              Unlock at LVL {requiredLevel}
            </>
          ) : (
            <>
              Claim Task
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </Link>
      </div>
    </div>
  )
}
