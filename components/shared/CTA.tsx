'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'

export default function CTA() {
  const router = useRouter()

  return (
    <section className="py-24 bg-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* CTA Card */}
        <div className="relative rounded-[2.5rem] overflow-x-clip overflow-y-visible border border-white/[0.06] min-h-[320px]"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #111 30%, #1a1208 60%, #1f1510 80%, #1a1008 100%)'
          }}
        >
          
          {/* Warm ambient glow behind the mascot */}
          <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(ellipse_at_70%_50%,_rgba(255,122,0,0.1)_0%,_transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 right-[20%] w-[400px] h-[200px] bg-[radial-gradient(ellipse_at_center,_rgba(255,122,0,0.06)_0%,_transparent_70%)] pointer-events-none" />
          
          {/* Floating particles */}
          <div className="absolute top-[20%] right-[30%] w-1.5 h-1.5 rounded-full bg-accent/40 animate-pulse" />
          <div className="absolute top-[35%] right-[48%] w-1 h-1 rounded-full bg-accent/30 animate-pulse [animation-delay:1s]" />
          <div className="absolute top-[15%] right-[22%] w-1 h-1 rounded-full bg-accent/25 animate-pulse [animation-delay:2s]" />
          <div className="absolute bottom-[30%] right-[40%] w-1.5 h-1.5 rounded-full bg-accent/20 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute top-[60%] right-[55%] w-1 h-1 rounded-full bg-accent/15 animate-pulse [animation-delay:1.5s]" />

          <div className="relative z-10 flex items-center min-h-[320px]">
            {/* Left side — Text + CTA */}
            <div className="flex-1 p-12 md:p-16 space-y-6">
              <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight leading-[1.1]">
                Ready to ship?
              </h2>
              <p className="text-lg text-white/50 font-light max-w-md">
                Join Forke and start earning while you code.
              </p>
              <Button 
                size="lg" 
                variant="primary"
                className="text-lg px-10 py-5 gap-2 rounded-xl"
                onClick={() => router.push('/register')}
              >
                Get Started Free <Zap className="w-5 h-5 fill-current" />
              </Button>
            </div>

            {/* Code snippet — positioned closer to the mascot */}
            <div className="hidden lg:block absolute right-[37%] top-1/3 -translate-y-1/2 opacity-[0.12]">
              <pre className="font-mono text-sm text-accent leading-relaxed">
{`const hustle = () => {
  ship();
  earn();
  repeat();
};`}
              </pre>
            </div>
          </div>

          {/* Right side — Chilling Forky Mascot (massive, overflows card) */}
          <div className="hidden md:block absolute -bottom-18 right-4 w-[750px] h-[520px] pointer-events-none">
            <Image 
              src="/forke-assets/landing-assets/chilling_forky.png" 
              alt="Chilling Forky" 
              fill
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
