import React from 'react'
import { auth } from '@/auth'
import { getTaskById, getLatestRevisionRequest } from '@/lib/db/queries/tasks'
import { 
  getLevelFromXp, 
  getRequiredLevel 
} from '@/lib/utils/xp'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClaimButton from '@/components/tasks/ClaimButton'
import SubmitWorkForm from '@/components/tasks/SubmitWorkForm'
import { Calendar, User, Clock, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years ago'
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'
  interval = seconds / 60
  return Math.floor(interval) + ' minutes ago'
}

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const currentUser = session?.user as { id: string; role: 'developer' | 'client'; level: number } | undefined
  const taskResult = await getTaskById(id)

  if (!taskResult) notFound()

  const { task, clientName, claimantName } = taskResult
  const isClaimedByMe = task.claimantId === currentUser?.id
  const isClaimedByOther = task.status !== 'open' && !isClaimedByMe
  const isDeveloper = currentUser?.role === 'developer'
  
  const userLevel = getLevelFromXp(currentUser?.xp || 0)
  const requiredLevel = getRequiredLevel(task.skillTags ?? [])
  const isLevelLocked = isDeveloper && userLevel < requiredLevel
  const revisionRequest = isClaimedByMe && task.status === 'claimed' ? await getLatestRevisionRequest(task.id) : null

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-8 space-y-10 font-sans">
      <Link href="/tasks" className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors text-xs font-bold uppercase tracking-widest group">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        Back to Browse
      </Link>

      <div className="space-y-12">
        {/* State Banner - Top Level */}
        {task.status === 'submitted' && (isClaimedByMe || currentUser?.role === 'client') && (
          <div className="p-8 bg-amber-50 border-2 border-amber-100 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border-dashed">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                <Clock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-amber-900 tracking-tight">Work Submitted</h3>
                <p className="text-amber-700/70 font-medium">Under review by the client. Hang tight!</p>
              </div>
            </div>
          </div>
        )}

        {task.status === 'approved' && (
          <div className="p-8 bg-green-50 border-2 border-green-100 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-green-900 tracking-tight">Task Approved</h3>
                <p className="text-green-700/70 font-medium">✓ Review completed. Final payment processing coming soon.</p>
              </div>
            </div>
            <div className="px-5 py-2 bg-green-100/50 rounded-xl text-[10px] font-bold text-green-600 uppercase tracking-widest">
              Completed
            </div>
          </div>
        )}

        {/* Form Section - When Claimed by Me and not submitted */}
        {isClaimedByMe && task.status === 'claimed' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
             <div className="lg:col-span-7 space-y-10">
                {revisionRequest && (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-8 space-y-4">
                    <div className="flex items-center gap-3 text-amber-800 font-bold uppercase tracking-widest text-[10px]">
                      <AlertCircle className="w-4 h-4" />
                      Revision Requested
                    </div>
                    <div className="p-6 bg-white/50 rounded-2xl border border-amber-200/50 italic text-amber-900">
                      &ldquo;{revisionRequest.clientNote}&rdquo;
                    </div>
                  </div>
                )}
                
                <div className="space-y-10">
                  <h1 className="font-serif text-5xl md:text-6xl text-[var(--color-text-primary)] leading-[1.1] tracking-tight">
                    {task.title}
                  </h1>
                  <div className="prose prose-amber max-w-none text-muted leading-relaxed text-xl font-medium whitespace-pre-wrap">
                    {task.description}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-8 border-t border-[var(--color-border)]">
                    {task.skillTags?.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-accent-light text-accent text-[11px] font-bold rounded-full uppercase tracking-wider font-mono border border-accent/10 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
             </div>

             <div className="lg:col-span-5">
               <div className="bg-white border-2 border-[var(--color-border)] rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/[0.03] space-y-10">
                  <div className="space-y-3">
                    <h2 className="text-3xl font-serif text-[var(--color-text-primary)] tracking-tight">Submit Your Work</h2>
                    <ul className="space-y-2">
                       <li className="flex items-center gap-2 text-xs font-medium text-muted/60">
                         <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Source code pushed to GitHub
                       </li>
                       <li className="flex items-center gap-2 text-xs font-medium text-muted/60">
                         <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> All requirements from description met
                       </li>
                    </ul>
                  </div>

                  <SubmitWorkForm taskId={task.id} />
               </div>
             </div>
          </div>
        )}

        {/* Standard Layout - Otherwise */}
        {(task.status !== 'claimed' || !isClaimedByMe) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-10">
              <h1 className="font-serif text-5xl md:text-6xl text-[var(--color-text-primary)] leading-[1.1] tracking-tight">
                {task.title}
              </h1>

              <div className="prose prose-amber max-w-none text-muted leading-relaxed text-xl font-medium whitespace-pre-wrap">
                {task.description}
              </div>

              <div className="flex flex-wrap gap-2 pt-8 border-t border-[var(--color-border)]">
                {task.skillTags?.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-accent-light text-accent text-[11px] font-bold rounded-full uppercase tracking-wider font-mono border border-accent/10 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
               <div className="bg-white border-2 border-[var(--color-border)] rounded-[2.5rem] p-8 space-y-8 sticky top-24 shadow-xl shadow-black/[0.02]">
                  <div className="space-y-2">
                     <span className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">Bounty</span>
                     <div className="text-5xl font-mono font-bold text-accent flex items-baseline gap-1">
                       <span className="text-2xl">₹</span>
                       {Math.floor(task.budget / 100)}
                     </div>
                  </div>

                  <div className="space-y-5 text-sm font-medium">
                    <div className="flex items-center gap-4 text-muted">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center">
                        <User className="w-5 h-5 text-accent/60" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-muted/60 font-bold">Client</span>
                        <span className="text-[var(--color-text-primary)] font-bold">{clientName}</span>
                      </div>
                    </div>
                    
                    {task.deadline && (
                      <div className="flex items-center gap-4 text-muted">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-accent/60" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-widest text-muted/60 font-bold">Deadline</span>
                          <span className="text-[var(--color-text-primary)] font-bold">{new Date(task.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-muted">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center">
                        <Clock className="w-5 h-5 text-accent/60" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-muted/60 font-bold">Posted</span>
                        <span className="text-[var(--color-text-primary)] font-bold">{timeAgo(task.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {task.status === 'open' && isDeveloper && (
                    <div className="pt-6 border-t border-[var(--color-border)]">
                      <ClaimButton 
                        taskId={task.id} 
                        isLocked={isLevelLocked} 
                        requiredLevel={requiredLevel} 
                      />
                    </div>
                  )}

                  {isClaimedByOther && (
                    <div className="pt-6 border-t border-[var(--color-border)] flex items-center gap-3 text-amber-600 font-bold text-xs uppercase tracking-widest">
                       <AlertCircle className="w-4 h-4" />
                       Claimed by {claimantName?.split(' ')[0]}
                    </div>
                  )}
               </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
