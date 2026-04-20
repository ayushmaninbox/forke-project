'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { useAuthModal } from '@/components/auth/AuthContext'

export default function CTA() {
  const { openSignInModal } = useAuthModal()

  return (
    <section className="py-24 bg-accent">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
        <h2 className="font-serif text-5xl md:text-7xl text-white">
          Ready to ship?
        </h2>
        <Button 
          size="lg" 
          className="bg-white text-accent hover:bg-zinc-100 border-none transition-transform hover:scale-105"
          onClick={openSignInModal}
        >
          Get Started Free
        </Button>
      </div>
    </section>
  )
}
