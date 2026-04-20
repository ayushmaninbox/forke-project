'use client'

import React from 'react'
import TaskCard from './TaskCard'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'

interface TaskFeedProps {
  tasks: {
    task: {
      id: string
      title: string
      budget: number
      skillTags: string[] | null
      createdAt: Date
    }
    clientName: string
  }[]
  userLevel: number
}

export default function TaskFeed({ tasks, userLevel }: TaskFeedProps) {
  const router = useRouter()

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-2xl border-2 border-dashed border-[var(--color-border)] shadow-sm">
        <div className="w-16 h-16 bg-[var(--color-bg-surface)] rounded-full flex items-center justify-center mb-6">
          <PlusCircle className="w-8 h-8 text-muted/20" />
        </div>
        <h3 className="text-xl font-serif text-[var(--color-text-primary)] mb-2">No tasks match your filters right now</h3>
        <p className="text-muted text-sm max-w-sm mx-auto mb-6 leading-relaxed">
          New tasks are posted every day — check back soon or try clearing your filters to see more opportunities.
        </p>
        <button 
          onClick={() => router.push('/tasks')}
          className="text-[10px] font-bold text-accent hover:text-amber-700 tracking-widest uppercase border-b-2 border-accent transition-colors pb-0.5"
        >
          Clear all filters
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {tasks.map(({ task, clientName }) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          clientName={clientName} 
          userLevel={userLevel} 
        />
      ))}
    </div>
  )
}
