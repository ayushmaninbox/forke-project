'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { completeOnboarding } from '@/lib/auth-actions'
import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { Info, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function OnboardingPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const needsGithubUrl = !session?.user?.githubUrl
  
  const [username, setUsername] = useState('')
  const [githubUrl, setGithubUrl] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    } else if (status === 'authenticated') {
      const isDeveloper = session.user.role === 'developer'
      const hasEverything = session.user.githubUrl && session.user.username
      
      if (!isDeveloper || hasEverything) {
        router.push('/dashboard')
      }
    }
  }, [status, session, router])

  if (status === 'loading') {
    return <Loader />
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = {
      username,
      githubUrl: needsGithubUrl ? githubUrl : undefined
    }

    const result = await completeOnboarding(formData)
    if (result.success) {
      await update()
      router.push('/dashboard')
    } else {
      setError(result.error || 'Failed to complete onboarding')
      setIsSubmitting(false)
    }
  }

  const handleGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setGithubUrl(val)
    let ghUsername = ''
    if (val.includes('github.com/')) {
      ghUsername = val.split('github.com/')[1].split('/')[0]
    } else {
      ghUsername = val.trim()
    }
    if (ghUsername && /^[a-zA-Z0-9_-]+$/.test(ghUsername) && !username) {
      setUsername(ghUsername)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center mb-7">
          <Image
            src="/forke-assets/forke_logo.png"
            alt="Forke Logo"
            width={72}
            height={72}
            className="mb-4"
          />
          <h1 className="text-xl font-semibold text-white tracking-tight">Complete your profile</h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-1.5 text-center max-w-xs">
            You&apos;re almost there — just a few more details to set up your workspace.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/[0.07] border border-red-500/20 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
            <Info className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-[13px] text-red-400 leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-white/[0.018] border border-[var(--color-border)] space-y-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] ml-0.5">Username</label>
              <input
                required
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="cool-dev_123"
                className="w-full h-10 bg-white/[0.02] border border-[var(--color-border)] rounded-lg px-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors"
              />
              <p className="text-[11px] text-[var(--color-text-muted)] ml-0.5">Max 30 chars. Only dashes (-) and underscores (_) allowed.</p>
            </div>

            {needsGithubUrl && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--color-text-muted)] ml-0.5">GitHub profile link</label>
                <input
                  required
                  name="githubUrl"
                  value={githubUrl}
                  onChange={handleGithubChange}
                  type="url"
                  placeholder="github.com/username"
                  className="w-full h-10 bg-white/[0.02] border border-[var(--color-border)] rounded-lg px-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !username || (needsGithubUrl && !githubUrl)}
            className="w-full h-10 text-[13px] font-medium rounded-lg ui-btn-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Continue to dashboard <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
