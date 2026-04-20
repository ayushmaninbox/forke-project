'use client'

import React, { useState, useTransition } from 'react'
import { approveSubmission, requestRevision } from '@/lib/actions/tasks'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { CheckCircle2, GitPullRequest, ExternalLink, MessageCircle, Clock, User } from 'lucide-react'

interface ReviewCardProps {
  task: {
    id: string
    title: string
    budget: number
  }
  submission: {
    id: string
    githubLink: string
    note: string | null
    createdAt: Date
  }
  claimantName: string
}

export default function ReviewCard({ task, submission, claimantName }: ReviewCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showRevisionInput, setShowRevisionInput] = useState(false)
  const [revisionNote, setRevisionNote] = useState('')
  const [rating, setRating] = useState(5)

  const handleApprove = async () => {
    if (!confirm(`Are you sure you want to approve this work with a ${rating}-star rating?`)) return
    
    startTransition(async () => {
      try {
        await approveSubmission(task.id, rating)
        router.refresh()
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to approve submission.'
        alert(message)
      }
    })
  }

  const handleRevision = async () => {
    if (!revisionNote) return
    
    startTransition(async () => {
      try {
        await requestRevision(task.id, revisionNote)
        router.refresh()
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to request revision.'
        alert(message)
      }
    })
  }

  return (
    <div className="bg-white border-2 border-[var(--color-border)] rounded-3xl p-8 space-y-8 shadow-sm hover:shadow-xl hover:shadow-black/[0.03] transition-all group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-accent-light flex items-center justify-center text-accent">
               <GitPullRequest className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-xl font-serif text-[var(--color-text-primary)] leading-none tracking-tight">
                 {task.title}
               </h3>
               <div className="flex items-center gap-2 mt-2 text-xs font-bold text-muted uppercase tracking-widest leading-none">
                 <User className="w-3 h-3" />
                 Submitted by <span className="text-accent">{claimantName}</span>
               </div>
             </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono text-muted/60">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {new Date(submission.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="text-accent font-bold">₹ {Math.floor(task.budget / 100)}</div>
          </div>
        </div>

        <a 
          href={submission.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-5 py-3 bg-[var(--color-bg-surface)] hover:bg-white border-2 border-transparent hover:border-accent/10 rounded-2xl transition-all group/link shadow-inner hover:shadow-none"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted/60 uppercase tracking-[0.2em] leading-none mb-1">Source Code</span>
            <span className="text-sm font-mono text-[var(--color-text-primary)] group-hover/link:text-accent transition-colors truncate max-w-[200px]">
              {submission.githubLink.replace('https://', '')}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-muted group-hover/link:text-accent group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
        </a>
      </div>

      {submission.note && (
        <div className="relative p-6 bg-accent-light/30 border-l-4 border-accent rounded-r-2xl">
          <MessageCircle className="absolute -top-3 -right-3 w-8 h-8 text-accent/10" />
          <p className="text-muted leading-relaxed italic text-sm font-medium">
            &ldquo;{submission.note}&rdquo;
          </p>
        </div>
      )}

      {showRevisionInput ? (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
           <div className="space-y-2">
             <label className="text-[10px] font-bold text-muted uppercase tracking-widest pl-1">What needs to be fixed?</label>
             <textarea 
               autoFocus
               value={revisionNote}
               onChange={(e) => setRevisionNote(e.target.value)}
               placeholder="Be specific. e.g. 'The API endpoint returns 404 for empty results, should return 200 []'"
               className="w-full bg-[var(--color-bg-surface)] border-2 border-[var(--color-border)] rounded-2xl p-4 text-sm font-medium transition-all focus:outline-none focus:border-amber-400 focus:bg-white min-h-[100px]"
             />
           </div>
           <div className="flex gap-3">
             <Button 
               onClick={handleRevision} 
               disabled={isPending || !revisionNote}
               className="flex-1 bg-amber-500 hover:bg-amber-600 shadow-amber-200"
             >
               SEND REVISION REQUEST
             </Button>
             <Button 
               variant="ghost" 
               onClick={() => setShowRevisionInput(false)}
               className="px-6"
             >
               CANCEL
             </Button>
           </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="p-6 bg-[var(--color-bg-surface)] rounded-[2rem] border border-[var(--color-border)] space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Quality Rating</label>
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                {rating === 5 ? 'Perfect' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    rating >= s 
                      ? 'bg-accent text-white shadow-lg shadow-accent/20 scale-110' 
                      : 'bg-white text-muted hover:bg-accent-light hover:text-accent'
                  }`}
                >
                  <span className="text-xl font-bold">★</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleApprove} 
              disabled={isPending}
              className="h-14 rounded-2xl shadow-lg shadow-accent/10"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              APPROVE WORK
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowRevisionInput(true)}
              disabled={isPending}
              className="h-14 rounded-2xl border-2 border-[var(--color-border)] hover:bg-amber-50/50 hover:text-amber-600 hover:border-amber-100 transition-all"
            >
              <GitPullRequest className="w-5 h-5 mr-2" />
              REQUEST REVISION
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
