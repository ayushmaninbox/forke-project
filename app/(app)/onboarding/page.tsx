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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      
      <div className="w-full max-w-[450px] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center mb-8">
          <Image 
            src="/forke-assets/forke_logo.png" 
            alt="Forke Logo" 
            width={120} 
            height={120} 
            className="drop-shadow-[0_0_20px_rgba(255,122,0,0.4)] mb-4"
          />
          <h1 className="text-3xl font-serif text-white tracking-tight">Complete your <span className="text-accent italic">Profile</span></h1>
          <p className="text-xs text-white/40 font-medium tracking-wide uppercase mt-2 text-center">
            You're almost there! We just need a few more details to set up your workspace.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-8 h-8 rounded-full border border-red-500/20 flex items-center justify-center bg-red-500/10 shrink-0">
              <Info className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-xs text-red-400 font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Username</label>
              <input 
                required
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text" 
                placeholder="cool-dev_123"
                className="w-full h-12 bg-[#0A0A0A] border border-white/5 rounded-2xl px-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all"
              />
              <p className="text-[10px] text-white/30 ml-1">Max 30 chars, case-sensitive. Only dashes (-) and underscores (_) allowed.</p>
            </div>

            {needsGithubUrl && (
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">GitHub Profile Link</label>
                <input 
                  required
                  name="githubUrl"
                  value={githubUrl}
                  onChange={handleGithubChange}
                  type="url" 
                  placeholder="github.com/username"
                  className="w-full h-12 bg-[#0A0A0A] border border-white/5 rounded-2xl px-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all"
                />
              </div>
            )}
          </div>

          <Button 
            type="submit"
            disabled={isSubmitting || !username || (needsGithubUrl && !githubUrl)}
            className="w-full h-14 text-sm font-black uppercase tracking-widest rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Continue to Dashboard <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
