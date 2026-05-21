import { auth } from '@/auth'
import TopBar from '@/components/shared/TopBar'
import { getTasksPendingReview, getTasksByClaimant } from '@/lib/db/queries/tasks'
import ReviewCard from '@/components/tasks/ReviewCard'
import ActiveTaskCard from '@/components/tasks/ActiveTaskCard'
import { AlertCircle, Clock, CheckCircle2, LayoutGrid } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user as { id: string; name: string; role: 'developer' | 'owner' } | undefined
  const firstName = user?.name?.split(' ')[0] || 'there'

  const pendingReviews = user?.role === 'owner' ? await getTasksPendingReview(user.id) : []
  const activeTasks = user?.role === 'developer' ? await getTasksByClaimant(user.id) : []

  return (
    <div className="flex flex-col h-full font-sans bg-[var(--color-bg)]">
      <TopBar title="Dashboard" />
      <div className="flex-grow p-8 overflow-y-auto space-y-12">
        {/* Welcome Section */}
        <div className="max-w-4xl space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-text-primary)] tracking-tight">
            Welcome back, <span className="text-accent italic">{firstName}</span>
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-lg font-medium tracking-wide">
            Here&apos;s an overview of your active workflow.
          </p>
        </div>

        {/* Role Based Content */}
        <div className="max-w-6xl space-y-10">
          
          {/* Client: Pending Reviews */}
          {user?.role === 'owner' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between animate-in fade-in zoom-in duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20 shadow-glow">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-[var(--color-text-primary)] tracking-tight">Pending <span className="text-accent italic">Reviews</span></h3>
                </div>
                <span className="px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black rounded-full border border-accent/20 uppercase tracking-widest shadow-[0_0_15px_rgba(255,122,0,0.2)]">
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
                <div className="p-12 border border-[var(--color-border)] rounded-[2.5rem] flex flex-col items-center text-center gap-4 glass bg-white shadow-sm">
                   <div className="w-16 h-16 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] relative group overflow-hidden">
                     <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                     <CheckCircle2 className="w-8 h-8 relative z-10 text-[var(--color-text-muted)]" />
                   </div>
                   <div className="space-y-2">
                     <p className="text-[var(--color-text-primary)] text-lg font-serif tracking-wide">All caught up!</p>
                     <p className="text-[var(--color-text-muted)] text-xs px-12 leading-relaxed">When developers submit work for your tasks, they&apos;ll appear here for review.</p>
                   </div>
                   <Link href="/post-task" className="mt-4 px-6 py-2.5 bg-[var(--color-bg-surface)] hover:bg-accent hover:text-white border border-[var(--color-border)] hover:border-accent/50 transition-all rounded-full text-[var(--color-text-muted)] hover:text-white font-black text-[10px] uppercase tracking-widest">
                     Post another task
                   </Link>
                </div>
              )}
            </section>
          )}

          {/* Developer: Active Tasks */}
          {user?.role === 'developer' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between animate-in fade-in zoom-in duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20 shadow-glow">
                    <LayoutGrid className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-[var(--color-text-primary)] tracking-tight">Active <span className="text-accent italic">Tasks</span></h3>
                </div>
                <span className="px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black rounded-full border border-accent/20 uppercase tracking-widest shadow-[0_0_15px_rgba(255,122,0,0.2)]">
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
                <div className="p-12 border border-[var(--color-border)] rounded-[2.5rem] flex flex-col items-center text-center gap-4 glass bg-white shadow-sm">
                   <div className="w-16 h-16 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] relative group overflow-hidden">
                     <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                     <AlertCircle className="w-8 h-8 relative z-10 text-[var(--color-text-muted)]" />
                   </div>
                   <div className="space-y-2">
                     <p className="text-[var(--color-text-primary)] text-lg font-serif tracking-wide">No active tasks</p>
                     <p className="text-[var(--color-text-muted)] text-xs px-12 leading-relaxed">You haven&apos;t claimed any tasks lately. Go find your next challenge!</p>
                   </div>
                   <Link href="/tasks" className="mt-4 px-6 py-2.5 bg-[var(--color-bg-surface)] hover:bg-accent hover:text-white border border-[var(--color-border)] hover:border-accent/50 transition-all rounded-full text-[var(--color-text-muted)] hover:text-white font-black text-[10px] uppercase tracking-widest">
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
