import { auth } from '@/auth'
import TopBar from '@/components/shared/TopBar'
import { getTasksPendingReview, getTasksByClaimant } from '@/lib/db/queries/tasks'
import ReviewCard from '@/components/tasks/ReviewCard'
import ActiveTaskCard from '@/components/tasks/ActiveTaskCard'
import { AlertCircle, Clock, CheckCircle2, LayoutGrid } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user as { id: string; name: string; role: 'developer' | 'client' } | undefined
  const firstName = user?.name?.split(' ')[0] || 'there'

  const pendingReviews = user?.role === 'client' ? await getTasksPendingReview(user.id) : []
  const activeTasks = user?.role === 'developer' ? await getTasksByClaimant(user.id) : []

  return (
    <div className="flex flex-col h-full font-sans bg-[#FAFAFA]">
      <TopBar title="Dashboard" />
      <div className="flex-grow p-8 overflow-y-auto space-y-12">
        {/* Welcome Section */}
        <div className="max-w-4xl space-y-2">
          <h2 className="font-serif text-5xl text-[var(--color-text-primary)] tracking-tight">
            Welcome back, {firstName}
          </h2>
          <p className="text-muted text-lg font-medium">
            Here&apos;s an overview of your active workflow.
          </p>
        </div>

        {/* Role Based Content */}
        <div className="max-w-6xl space-y-10">
          
          {/* Client: Pending Reviews */}
          {user?.role === 'client' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-serif text-[var(--color-text-primary)]">Pending Reviews</h3>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100 uppercase tracking-widest">
                  {pendingReviews.length} ACTION REQUIRED
                </span>
              </div>

              {pendingReviews.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {pendingReviews.map((item) => (
                    <ReviewCard 
                      key={item.task.id}
                      task={item.task}
                      submission={item.submission}
                      claimantName={item.claimantName}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center text-center gap-4 bg-white/50">
                   <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                     <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <div className="space-y-1">
                     <p className="text-[var(--color-text-primary)] font-bold">All caught up!</p>
                     <p className="text-muted text-sm px-12">When developers submit work for your tasks, they&apos;ll appear here for review.</p>
                   </div>
                   <Link href="/post-task" className="mt-2 text-accent font-bold text-xs uppercase tracking-widest hover:underline">
                     Post another task
                   </Link>
                </div>
              )}
            </section>
          )}

          {/* Developer: Active Tasks */}
          {user?.role === 'developer' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-accent-light flex items-center justify-center text-accent shadow-inner">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-serif text-[var(--color-text-primary)]">My Active Tasks</h3>
                </div>
                <span className="px-3 py-1 bg-accent-light text-accent text-[10px] font-bold rounded-full border border-accent/10 uppercase tracking-widest">
                  {activeTasks.length} IN PROGRESS
                </span>
              </div>

              {activeTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeTasks.map((item) => (
                    <ActiveTaskCard 
                      key={item.task.id}
                      task={item.task}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center text-center gap-4 bg-white/50">
                   <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                     <AlertCircle className="w-6 h-6" />
                   </div>
                   <div className="space-y-1">
                     <p className="text-[var(--color-text-primary)] font-bold">No active tasks</p>
                     <p className="text-muted text-sm">You haven&apos;t claimed any tasks lately. Go find your next challenge!</p>
                   </div>
                   <Link href="/tasks" className="mt-2 text-accent font-bold text-xs uppercase tracking-widest hover:underline">
                     Browse tasks
                   </Link>
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  )
}
