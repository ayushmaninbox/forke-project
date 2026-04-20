import React, { Suspense } from 'react'
import { auth } from '@/auth'
import { getOpenTasks } from '@/lib/db/queries/tasks'
import { getLevelFromXp } from '@/lib/utils/tasks'
import TaskFilters from '@/components/tasks/TaskFilters'
import TaskFeed from '@/components/tasks/TaskFeed'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Tasks | Forke',
  description: 'Find micro-tasks that match your skills and level.',
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[]; maxBudget?: string }>
}) {
  const session = await auth()
  const user = session?.user as { id: string; xp: number } | undefined
  const userLevel = getLevelFromXp(user?.xp || 0)
  const params = await searchParams

  const tags = typeof params.tag === 'string' ? [params.tag] : params.tag
  const maxBudget = params.maxBudget ? parseInt(params.maxBudget) : undefined

  const tasks = await getOpenTasks({ skillTags: tags, maxBudget })

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 space-y-12">
      <div className="flex flex-col gap-4">
        <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-[var(--color-text-primary)] tracking-tight">
          Browse Tasks
        </h1>
        <p className="text-muted text-lg md:text-xl max-w-2xl font-medium">
          Find work that matches your skills. Claim it. Ship it. Get paid.
        </p>
      </div>

      <div className="space-y-10">
        <TaskFilters />

        <Suspense fallback={<TaskFeedSkeleton />}>
          <TaskFeed tasks={tasks} userLevel={userLevel} />
        </Suspense>
      </div>
    </div>
  )
}

function TaskFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-64 rounded-xl bg-white border border-[var(--color-border)] animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent -translate-x-full animate-shimmer" />
        </div>
      ))}
    </div>
  )
}
