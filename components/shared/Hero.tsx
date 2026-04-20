'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { useAuthModal } from '@/components/auth/AuthContext'

export default function Hero() {
  const { openSignInModal } = useAuthModal()

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center bg-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="font-serif text-6xl md:text-8xl text-[var(--color-text-primary)] leading-tight">
          Ship real work. <br />
          Get <span className="text-accent">paid.</span>
        </h1>
        
        <p className="font-sans text-xl md:text-2xl text-muted max-w-2xl mx-auto leading-relaxed">
          Micro-tasks for developers. Post a bug fix, claim a feature, get paid in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" variant="primary" className="w-full sm:w-auto" onClick={openSignInModal}>
            Start Earning
          </Button>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={openSignInModal}>
            Post a Task
          </Button>
        </div>

        <div className="pt-8">
          <p className="text-muted text-sm tracking-wide">
            Joined by <span className="text-[var(--color-text-primary)] font-medium">200+ developers</span> across 12 colleges
          </p>
        </div>
      </div>
    </section>
  )
}
