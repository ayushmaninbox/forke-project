'use client'

import React, { useTransition } from 'react'
import { claimTask } from '@/lib/actions/tasks'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, AlertCircle, Lock } from 'lucide-react'

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
      <Button disabled className="w-full h-14 text-lg font-serif opacity-50 cursor-not-allowed shadow-none border-dashed border-2">
        <Lock className="w-5 h-5 mr-3 text-muted" />
        Unlock at LVL {requiredLevel}
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      <Button 
        onClick={handleClaim} 
        disabled={isPending}
        className="w-full h-14 text-lg font-serif shadow-xl shadow-accent/20"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Claiming...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            Claim This Task
          </span>
        )}
      </Button>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-xs font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      
      <p className="text-[10px] text-muted text-center italic">
        By claiming, you commit to delivering quality work by the deadline.
      </p>
    </div>
  )
}
