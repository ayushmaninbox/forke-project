'use client'

import React, { useState, useActionState, useEffect } from 'react'
import { submitWork } from '@/lib/actions/tasks'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, XCircle, GitPullRequest, Link as LinkIcon, Send, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface SubmitWorkFormProps {
  taskId: string
}

export default function SubmitWorkForm({ taskId }: SubmitWorkFormProps) {
  const router = useRouter()
  const [url, setUrl] = useState('')

  const [state, action, isPending] = useActionState(submitWork, null)

  // Calculate validity during render to avoid cascading renders
  let isValidUrl: boolean | null = null
  if (url !== '') {
    try {
      const parsedUrl = new URL(url)
      isValidUrl = parsedUrl.protocol === 'https:' && url.length > 10
    } catch {
      isValidUrl = false
    }
  }

  useEffect(() => {
    if (state?.success) {
      router.refresh()
    }
  }, [state, router])

  if (state?.success) {
    return (
      <div className="p-8 bg-green-50/50 border-2 border-green-100 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center shadow-inner">
            <Sparkles className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif text-green-900 tracking-tight">Work Submitted!</h3>
            <p className="text-green-700/70 font-medium">Waiting for client review. Great job!</p>
          </div>
          <div className="w-full p-4 bg-white/50 rounded-2xl border border-green-100/50 space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold text-green-600 uppercase tracking-widest">
              <span>Your Submission</span>
              <span>{new Date(state.submittedAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-3 text-green-900 font-mono text-sm break-all">
              <GitPullRequest className="w-4 h-4 shrink-0" />
              {state.githubLink}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="taskId" value={taskId} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="githubLink" className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
            Your submission link
          </label>
          <div className="flex items-center gap-2">
            {isValidUrl === true && (
              <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VALID URL
              </span>
            )}
            {isValidUrl === false && (
              <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> INVALID URL
              </span>
            )}
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
            <LinkIcon className="w-5 h-5" />
          </div>
          <input
            id="githubLink"
            name="githubLink"
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repo-link"
            className="w-full bg-[var(--color-bg-surface)] border-2 border-[var(--color-border)] rounded-2xl py-4 pl-14 pr-6 text-[var(--color-text-primary)] font-medium transition-all focus:outline-none focus:border-accent focus:bg-white placeholder:text-muted/40"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="note" className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
            Note to client
          </label>
          <span className={cn(
             "text-[10px] font-bold tracking-widest text-muted/40"
          )}>
            Optional submission note
          </span>
        </div>
        <textarea
          id="note"
          name="note"
          rows={4}
          maxLength={300}
          placeholder="Briefly explain what you built, any decisions you made, or anything the client should know."
          className="w-full bg-[var(--color-bg-surface)] border-2 border-[var(--color-border)] rounded-2xl py-4 px-6 text-[var(--color-text-primary)] font-medium transition-all focus:outline-none focus:border-accent focus:bg-white placeholder:text-muted/40 resize-none leading-relaxed"
        />
      </div>

      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-1">
          <XCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending || isValidUrl !== true}
        className="w-full py-7 text-lg rounded-2xl shadow-xl shadow-accent/20 group"
      >
        <div className="flex items-center justify-center gap-3">
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              SUBMITTING...
            </>
          ) : (
            <>
              SUBMIT FOR REVIEW
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </div>
      </Button>
    </form>
  )
}
