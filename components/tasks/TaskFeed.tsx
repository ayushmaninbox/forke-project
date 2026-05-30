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
  isOwner?: boolean
}

export default function TaskFeed({ tasks, userLevel, isOwner = false }: TaskFeedProps) {
  const router = useRouter()

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl border border-dashed border-[var(--color-border)] bg-white/[0.01]">
        <div className="w-10 h-10 bg-white/[0.02] rounded-full border border-[var(--color-border)] flex items-center justify-center mb-4">
          <PlusCircle className="w-5 h-5 text-[var(--color-text-muted)]" />
        </div>
        <h3 className="text-sm font-medium text-white mb-1.5">
          {isOwner ? 'No open tasks on the feed' : 'No tasks match your filters'}
        </h3>
        <p className="text-[13px] text-[var(--color-text-muted)] max-w-sm mx-auto mb-4 leading-relaxed">
          {isOwner
            ? 'Post a new task to attract talented developers to your project.'
            : 'New tasks are posted every day — check back soon or try clearing your filters.'}
        </p>
        <button
          onClick={() => router.push(isOwner ? '/post-task' : '/tasks')}
          className="inline-flex items-center h-8 px-3.5 rounded-lg text-[13px] font-medium ui-btn-secondary transition-colors"
        >
          {isOwner ? 'Post a task' : 'Clear filters'}
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {tasks.map(({ task, clientName }) => (
        <TaskCard
          key={task.id}
          task={task}
          clientName={clientName}
          userLevel={userLevel}
          isOwner={isOwner}
        />
      ))}
    </div>
  )
}
