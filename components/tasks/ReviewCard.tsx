'use client'

import React, { useState, useTransition } from 'react'
import { approveSubmission, requestRevision } from '@/lib/actions/tasks'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { CheckCircle2, GitPullRequest, ExternalLink, MessageCircle, Clock, User } from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import { LevelUpModal } from '@/components/ui/LevelUpModal'

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
  const [rating, setRating] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [newLevelInfo, setNewLevelInfo] = useState<number | null>(null)

  const handleApprove = async (selectedRating: number) => {
    if (!confirm(`Are you sure you want to approve this work with a ${selectedRating}-star rating?`)) return
    
    startTransition(async () => {
      try {
        const result = await approveSubmission(task.id, selectedRating)
        if (result && result.leveledUp) {
          setNewLevelInfo(result.newLevel)
        } else {
          router.refresh()
        }
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
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-8 glass hover:border-accent/40 hover:bg-accent/[0.02] transition-all group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20 shadow-glow">
               <GitPullRequest className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-xl font-serif text-white leading-none tracking-tight">
                 {task.title}
               </h3>
               <div className="flex items-center gap-2 mt-2 text-xs font-bold text-white/40 uppercase tracking-widest leading-none">
                 <User className="w-3 h-3" />
                 Submitted by <span className="text-accent">{claimantName}</span>
               </div>
             </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono text-white/40">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {new Date(submission.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="text-accent font-bold">₹ {Math.floor(task.budget / 100)}</div>
          </div>
        </div>

        <a 
          href={submission.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-5 py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-accent/40 rounded-2xl transition-all group/link"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] leading-none mb-1">Source Code</span>
            <span className="text-sm font-mono text-white/80 group-hover/link:text-accent transition-colors truncate max-w-[200px]">
              {submission.githubLink.replace('https://', '')}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-white/40 group-hover/link:text-accent group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
        </a>
      </div>

      {submission.note && (
        <div className="relative p-6 bg-accent/5 border-l-4 border-accent rounded-r-2xl">
          <MessageCircle className="absolute -top-3 -right-3 w-8 h-8 text-accent/20" />
          <p className="text-white/60 leading-relaxed italic text-sm font-medium">
            &ldquo;{submission.note}&rdquo;
          </p>
        </div>
      )}

      {showRevisionInput ? (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
           <div className="space-y-2">
             <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">What needs to be fixed?</label>
             <textarea 
               autoFocus
               value={revisionNote}
               onChange={(e) => setRevisionNote(e.target.value)}
               placeholder="Be specific. e.g. 'The API endpoint returns 404 for empty results, should return 200 []'"
               className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-medium text-white placeholder:text-white/20 transition-all focus:outline-none focus:border-accent/50 focus:bg-accent/[0.02] min-h-[100px]"
             />
           </div>
           <div className="flex gap-3">
             <Button 
               onClick={handleRevision} 
               disabled={isPending || !revisionNote}
               className="flex-1 bg-accent hover:bg-accent-hover text-white shadow-glow"
             >
               SEND REVISION REQUEST
             </Button>
             <Button 
               variant="outline" 
               onClick={() => setShowRevisionInput(false)}
               className="px-6 border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06]"
             >
               CANCEL
             </Button>
           </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="p-6 bg-white/[0.03] rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Quality Rating</label>
              {rating && (
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest animate-in fade-in slide-in-from-right-1">
                  {['', 'Needs work', 'Below average', 'Good', 'Great', 'Outstanding'][rating]}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 active:scale-95 duration-200"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <svg
                    width="40" height="40" viewBox="0 0 24 24"
                    className="transition-colors duration-300"
                    fill={(hovered ?? rating ?? 0) >= star ? '#FF7A00' : 'none'}
                    stroke={(hovered ?? rating ?? 0) >= star ? '#FF7A00' : 'rgba(255,255,255,0.1)'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => handleApprove(rating!)} 
              disabled={isPending || !rating}
              className={cn(
                "h-14 rounded-2xl shadow-lg transition-all",
                rating 
                  ? "bg-accent hover:bg-accent-hover text-white shadow-glow" 
                  : "bg-white/5 text-white/20 cursor-not-allowed shadow-none"
              )}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {rating ? 'APPROVE WORK' : 'RATE TO APPROVE'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowRevisionInput(true)}
              disabled={isPending}
              className="h-14 rounded-2xl border border-white/5 bg-white/[0.03] text-white/60 hover:bg-accent/10 hover:text-accent hover:border-accent/40 transition-all font-bold"
            >
              <GitPullRequest className="w-5 h-5 mr-2" />
              REQUEST REVISION
            </Button>
          </div>
        </div>
      )}

      <LevelUpModal 
        newLevel={newLevelInfo} 
        onClose={() => setNewLevelInfo(null)} 
      />
    </div>
  )
}
