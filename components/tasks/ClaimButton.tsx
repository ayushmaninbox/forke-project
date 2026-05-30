'use client'

import React, { useTransition } from 'react'
import { claimTask } from '@/lib/actions/tasks'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, AlertCircle, Lock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ClaimButtonProps {
  taskId: string
  isLocked: boolean
  requiredLevel: number
}

export default function ClaimButton({ taskId, isLocked, requiredLevel }: ClaimButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = React.useState<string | null>(null)

  const handleClaim = () => {
    setError(null)
    startTransition(async () => {
      try {
        await claimTask(taskId)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        setError(message)
      }
    })
  }

  if (isLocked) {
    return (
      <Button disabled className="w-full h-10 text-[13px] font-medium bg-white/[0.02] text-white/30 border border-[var(--color-border)] cursor-not-allowed rounded-lg flex items-center justify-center gap-2">
        <Lock className="w-4 h-4" />
        Unlock at Lvl {requiredLevel}
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleClaim}
        disabled={isPending}
        className="w-full h-10 text-[13px] font-medium ui-btn-primary transition-colors cursor-pointer rounded-lg"
      >
        {isPending ? (
          <span className="flex items-center gap-2 justify-center">
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Claiming...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Claim this task
          </span>
        )}
      </Button>

      {error && (
        <div className="p-3 bg-red-500/[0.07] border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <p className="text-[11px] text-[var(--color-text-muted)] text-center">
        By claiming, you commit to delivering quality work by the deadline.
      </p>
    </div>
  )
}
