import React from 'react'
import { auth } from '@/auth'
import PostTaskForm from '@/components/tasks/PostTaskForm'
import Link from 'next/link'
import { Search, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default async function PostTaskPage() {
  const session = await auth()
  const user = session?.user as { id: string; role: 'developer' | 'client' } | undefined

  if (user?.role === 'developer') {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 text-accent mb-4">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-[var(--color-text-primary)]">Clients Only</h1>
          <p className="text-muted text-lg max-w-md mx-auto leading-relaxed">
            Task posting is reserved for clients who want to get work done. As a developer, your path is to help others ship!
          </p>
        </div>
        <div className="pt-4">
          <Link href="/tasks">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Browse Open Tasks
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif text-[var(--color-text-primary)]">Post a New Task</h1>
        <p className="text-muted">Fill in the details below to find the right person for your project.</p>
      </div>
      
      <PostTaskForm />
    </div>
  )
}
