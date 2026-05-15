'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useAuthModal } from '@/components/auth/AuthContext'
import { Zap, Flame, Star, CheckCircle2 } from 'lucide-react'
import LiveTaskTicker from './LiveTaskTicker'

export default function Hero() {
  const { openSignInModal } = useAuthModal()

  return (
    <section className="relative pt-32 pb-14 overflow-hidden bg-bg min-h-screen flex items-center">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_var(--color-accent-muted)_0%,_transparent_70%)] opacity-50" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 blur-[100px] rounded-full" />
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-12 relative z-30">
            <div className="space-y-6">
              <h1 className="font-serif text-6xl md:text-8xl text-white leading-[1.1] tracking-tight">
                Ship real work. <br />
                Earn XP. <span className="text-accent text-glow">Get paid.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted max-w-xl leading-relaxed font-light">
                Micro-task marketplace for developers. Claim bounties, build reputation and cash out instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Button 
                size="lg" 
                className="gap-2 text-lg px-8 py-5 rounded-xl bg-gradient-to-b from-accent to-[#d97706] border-b-2 border-black/30 shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(180,83,9)] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-bg font-bold tracking-tight"
                onClick={openSignInModal}
              >
                Start Grinding <Zap className="w-5 h-5 fill-current" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-5 rounded-xl border-2 border-accent/20 text-accent hover:bg-accent/5 transition-all font-bold"
                onClick={openSignInModal}
              >
                Post a Task
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-bg bg-surface flex items-center justify-center overflow-hidden">
                    <Image 
                      src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                      alt="User avatar" 
                      width={48} 
                      height={48} 
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">Trusted by <span className="text-accent">200+ developers</span></p>
                <p className="text-muted">from 12+ colleges</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Area - Orbital Layout */}
          <div className="absolute right-[-300px] top-1/2 -translate-y-1/2 w-[1200px] h-[1200px] pointer-events-none">
            
            {/* Connecting Lines SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible opacity-20">
              <defs>
                <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="var(--color-accent)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path d="M 300 450 Q 450 500 600 600" stroke="url(#line-grad)" strokeWidth="1" fill="transparent" className="animate-pulse" />
              <path d="M 900 350 Q 800 450 650 600" stroke="url(#line-grad)" strokeWidth="1" fill="transparent" className="animate-pulse" />
            </svg>

            {/* The Mascot */}
            <div 
              className="absolute inset-0 flex items-center justify-center z-10"
              style={{
                maskImage: 'radial-gradient(circle, black 70%, transparent 95%)',
                WebkitMaskImage: 'radial-gradient(circle, black 70%, transparent 95%)',
              }}
            >
               <Image 
                 src="/forke-assets/landing-assets/hero-image-forky.png" 
                 alt="Forky Mascot" 
                 fill
                 className="object-contain"
                 priority
               />
            </div>

            {/* Floating Rupees */}
            <div className="absolute top-[45%] left-[25%] w-14 h-14 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-xl font-bold animate-bounce [animation-duration:3s] z-0 rotate-[-5deg]">₹</div>
            <div className="absolute top-[58%] right-[25%] w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-lg font-bold animate-bounce [animation-duration:4s] [animation-delay:1s] z-0 rotate-[9deg]">₹</div>

            {/* Floating Task Cards */}
            <div className="absolute top-[28%] left-[26%] glass p-3 rounded-xl shadow-glow animate-bounce [animation-duration:6s] z-0 pointer-events-auto transition-transform">
              <div className="flex items-center justify-between gap-6 mb-1">
                <span className="text-xs font-medium text-white">Fix navbar overflow</span>
                <span className="text-accent font-bold text-xs">₹300</span>
              </div>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold tracking-wider uppercase">Bug Fix</span>
            </div>

            <div className="absolute top-[42%] right-[19.5%] glass p-3 rounded-xl shadow-glow animate-bounce [animation-duration:7s] [animation-delay:1s] z-20 pointer-events-none transition-transform">
              <div className="flex items-center justify-between gap-6 mb-1">
                <span className="text-xs font-medium text-white">Add dark mode</span>
                <span className="text-accent font-bold text-xs">₹600</span>
              </div>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold tracking-wider uppercase">React</span>
            </div>

            {/* Streak Badge - Horizontal Pill */}
            <div className="absolute top-[24%] right-[42%] glass-orange px-4 py-2 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(255,122,0,0.2)] animate-pulse z-20 border border-white/20 pointer-events-none hover:scale-105 transition-transform">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-accent fill-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-lg leading-none">7</span>
                <span className="text-[8px] text-accent uppercase font-bold tracking-widest">Day Streak</span>
              </div>
            </div>

            {/* XP Badge - Tucked behind right ear tip */}
            <div className="absolute top-[27%] right-[30%] glass px-3 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-2xl z-10 pointer-events-none rotate-[7deg] animate-in fade-in zoom-in duration-1000">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-accent font-bold text-sm">+250 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Bounty Feed at the bottom of Hero */}
      <div className="absolute bottom-0 left-0 w-full">
        <LiveTaskTicker isHeroEmbedded />
      </div>
    </section>
  )
}
