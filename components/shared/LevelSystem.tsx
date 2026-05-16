import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

const LEVELS = [
  { 
    lvl: 1, 
    label: 'Newcomer', 
    tasks: 'HTML/CSS, Basic Bug Fixes', 
    range: '₹200 - ₹500', 
    image: '/forke-assets/landing-assets/newcomer_forky.png'
  },
  { 
    lvl: 2, 
    label: 'Apprentice', 
    tasks: 'React Components, CSS Logic', 
    range: '₹500 - ₹1200', 
    image: '/forke-assets/landing-assets/apprentice_forky.png'
  },
  { 
    lvl: 3, 
    label: 'Builder', 
    tasks: 'API Hooks, Full-stack Features', 
    range: '₹1200 - ₹3000', 
    isActive: true,
    image: '/forke-assets/landing-assets/builder_forky.png'
  },
  { 
    lvl: 4, 
    label: 'Expert', 
    tasks: 'System Architecture, Database Fixes', 
    range: '₹3000 - ₹8000', 
    image: '/forke-assets/landing-assets/expert_forky.png'
  },
  { 
    lvl: 5, 
    label: 'Architect', 
    tasks: 'Performance at Scale, Cloud DevOps', 
    range: '₹8000+', 
    image: '/forke-assets/landing-assets/architect_forky.png'
  },
]

const CURRENT_LEVEL = 3

export default function LevelSystem() {
  return (
    <section id="levels" className="py-32 px-4 bg-bg relative overflow-hidden border-t border-white/[0.05]">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-accent-muted)_0%,_transparent_70%)] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Header */}
        <div className="space-y-4 mb-16">
          <h2 className="font-serif text-5xl md:text-7xl text-white flex items-center justify-center gap-3">
            The Level System <span className="text-accent text-3xl">✦</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto font-light leading-relaxed">
            The more you ship, the faster you level up. <br />
            Higher levels unlock bigger task budgets and exclusive bounties.
          </p>
        </div>

        {/* Progress Indicator Row */}
        <div className="relative flex items-center justify-between max-w-4xl mx-auto mb-16 px-8">
          {/* Base Connecting Line */}
          <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-white/5 -translate-y-1/2" />
          
          {/* Glowing Progress Line - Radiating from 3 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60 shadow-[0_0_15px_rgba(255,122,0,0.5)]" />
          
          {LEVELS.map((item) => (
            <div 
              key={item.lvl}
              className={cn(
                "relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300",
                item.isActive 
                  ? "bg-accent text-bg w-14 h-14 shadow-[0_0_30px_rgba(255,122,0,0.6)] border-2 border-accent" 
                  : "bg-[#1a1a1a] text-white/40 border border-white/10"
              )}
            >
              {item.lvl}
              {item.isActive && (
                <div className="absolute inset-0 rounded-full bg-accent/20 blur-md -z-10 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {LEVELS.map((item, index) => (
            <div 
              key={index} 
              className={cn(
                "relative rounded-2xl border p-6 pt-7 pb-8 text-left flex flex-col group overflow-visible min-h-[420px]",
                item.isActive 
                  ? "bg-[#111] border-accent/70 shadow-[0_0_60px_rgba(255,122,0,0.15),_0_0_20px_rgba(255,122,0,0.08),_inset_0_1px_0_rgba(255,122,0,0.15)]" 
                  : "bg-gradient-to-b from-[#151515] to-[#0d0d0d] border-white/[0.06]"
              )}
            >
              {/* Internal Card Glow for active */}
              {item.isActive && (
                <>
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.12)_0%,_transparent_60%)] pointer-events-none" />
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_100%,_rgba(255,122,0,0.06)_0%,_transparent_50%)] pointer-events-none" />
                  <div className="absolute -inset-px rounded-2xl border border-accent/30 pointer-events-none" />
                </>
              )}

              {/* Card Header */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <h4 className="font-bold text-xl text-white tracking-tight">{item.label}</h4>
                {item.isActive && (
                  <span className="text-[9px] border border-accent/50 text-accent px-2.5 py-0.5 rounded-md uppercase font-black tracking-wider bg-accent/10">
                    Level Up
                  </span>
                )}
              </div>

              {/* Unlocks */}
              <div className="mb-4 relative z-10">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Unlocks</p>
                <p className="text-sm text-white/80 leading-relaxed font-medium">{item.tasks}</p>
              </div>

              {/* Bounty Range */}
              <div className="mb-4 relative z-10">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-0.5">Bounty Range</p>
                <p className="text-xl font-bold text-accent">{item.range}</p>
              </div>

              {/* Mascot Image — Absolutely positioned to break out of the card width */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[160%] h-72 pointer-events-none">
                <div className={cn(
                  "relative w-full h-full transition-transform duration-500",
                  (index === 2 || index === 4) && "-scale-x-100"
                )}>
                  <Image 
                    src={item.image} 
                    alt={item.label} 
                    fill
                    className="object-contain object-bottom"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Card */}
        <div className="mt-32 p-12 rounded-[3rem] bg-[#111]/40 border border-white/[0.04] backdrop-blur-xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-wrap justify-center items-center gap-16 md:gap-24">
            {/* Stat 1 */}
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full border border-white/[0.05] flex items-center justify-center text-accent/80">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-4xl font-bold text-white tracking-tight">1,240+</p>
                <p className="text-[11px] text-white/30 font-normal tracking-wide">Tasks Completed</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full border border-white/[0.05] flex items-center justify-center text-accent/80">
                <span className="text-xl font-medium">₹</span>
              </div>
              <div className="text-left">
                <p className="text-4xl font-bold text-white tracking-tight">₹4.8L+</p>
                <p className="text-[11px] text-white/30 font-normal tracking-wide">Total Paid Out</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full border border-white/[0.05] flex items-center justify-center text-accent/80">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-4xl font-bold text-white tracking-tight">850+</p>
                <p className="text-[11px] text-white/30 font-normal tracking-wide">Active Developers</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full border border-white/[0.05] flex items-center justify-center text-accent/80">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-4xl font-bold text-white tracking-tight">12+</p>
                <p className="text-[11px] text-white/30 font-normal tracking-wide">Colleges Reached</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
