'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useAuthModal } from '@/components/auth/AuthContext'
import { Zap } from 'lucide-react'

export default function CTA() {
  const { openSignInModal } = useAuthModal()

  return (
    <section className="py-32 bg-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-accent/5" />
      
      {/* Stylized Code Background */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 opacity-10 hidden lg:block">
        <pre className="font-mono text-sm text-accent">
          {`const hustle = () => {
  ship();
  earn();
  repeat();
};`}
        </pre>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="font-serif text-6xl md:text-8xl text-white tracking-tight leading-none">
                Ready to <span className="text-accent text-glow">ship?</span>
              </h2>
              <p className="text-xl text-muted font-light">Join Forke and start earning while you code.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="primary"
                className="text-xl px-12 py-6 gap-2"
                onClick={openSignInModal}
              >
                Get Started Free <Zap className="w-6 h-6 fill-current" />
              </Button>
            </div>
            <p className="text-muted text-xs uppercase tracking-[0.2em] font-bold">No credit card required • Get paid in minutes</p>
          </div>

          <div className="relative h-[400px] flex items-center justify-center">
             <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
             <Image 
               src="/forke-assets/forky-reactions/boss_mode_forky.png" 
               alt="Boss Forky" 
               width={400} 
               height={400} 
               className="object-contain relative z-10 drop-shadow-[0_0_30px_rgba(255,122,0,0.4)]"
             />
          </div>
        </div>
      </div>
    </section>
  )
}
