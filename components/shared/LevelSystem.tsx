import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

const LEVELS = [
  { 
    lvl: 1, 
    label: 'Newcomer', 
    tasks: 'HTML/CSS, Basic Bug Fixes', 
    range: '₹200 - ₹500', 
    isLocked: false,
    image: '/forke-assets/forky-reactions/dead_inside_forky.png'
  },
  { 
    lvl: 2, 
    label: 'Apprentice', 
    tasks: 'React Components, CSS Logic', 
    range: '₹500 - ₹1200', 
    isLocked: false,
    image: '/forke-assets/forky-reactions/default_forky.png'
  },
  { 
    lvl: 3, 
    label: 'Builder', 
    tasks: 'API Hooks, Full-stack Features', 
    range: '₹1200 - ₹3000', 
    isLocked: false,
    isActive: true,
    image: '/forke-assets/forky-reactions/excited_forky.png'
  },
  { 
    lvl: 4, 
    label: 'Expert', 
    tasks: 'System Architecture, Database Fixes', 
    range: '₹3000 - ₹8000', 
    isLocked: true,
    image: '/forke-assets/forky-reactions/locked_in_forky.png'
  },
  { 
    lvl: 5, 
    label: 'Architect', 
    tasks: 'Performance at Scale, Cloud DevOps', 
    range: '₹8000+', 
    isLocked: true,
    image: '/forke-assets/forky-reactions/boss_mode_forky.png'
  },
]

export default function LevelSystem() {
  return (
    <section className="py-32 px-4 bg-bg relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-accent-muted)_0%,_transparent_70%)] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="space-y-4 mb-24">
          <h2 className="font-serif text-5xl md:text-7xl text-white flex items-center justify-center gap-4">
            The Level System <span className="text-accent text-3xl">✦</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto font-light">
            The more you ship, the faster you level up. <br />
            Higher levels unlock bigger task budgets and exclusive bounties.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-stretch gap-6 overflow-x-auto pb-12 snap-x scrollbar-hide">
          {/* Progress Line */}
          <div className="absolute top-[35px] left-12 right-12 h-[1px] bg-white/5 hidden md:block" />
          
          {LEVELS.map((item, index) => (
            <div 
              key={index} 
              className={cn(
                "relative flex flex-col items-center flex-1 min-w-[240px] snap-center px-1 transition-all duration-500",
                item.isActive ? "z-20" : "opacity-40"
              )}
            >
              {/* Dot */}
              <div 
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-8 z-10 border transition-all duration-300",
                  item.isActive 
                    ? "bg-accent border-accent text-bg shadow-[0_0_20px_rgba(255,122,0,0.5)]" 
                    : "bg-[#1a1a1a] border-white/10 text-muted"
                )}
              >
                <span className="font-sans font-bold text-lg">{item.lvl}</span>
              </div>

              {/* Card */}
              <div 
                className={cn(
                  "p-8 rounded-[2rem] border-2 w-full text-left space-y-8 transition-all duration-500 h-full flex flex-col min-h-[480px] group",
                  item.isActive 
                    ? "bg-[#111] border-accent/60 shadow-[0_0_40px_rgba(255,122,0,0.15)] ring-1 ring-accent/20" 
                    : "bg-[#0d0d0d] border-white/[0.03] hover:border-white/10"
                )}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-2xl text-white tracking-tight">{item.label}</h4>
                  {item.isActive && (
                    <span className="text-[10px] border border-accent/40 text-accent px-3 py-1 rounded-full uppercase font-black tracking-widest bg-accent/5">
                      Current
                    </span>
                  )}
                </div>
                
                {/* Unlocks */}
                <div className="space-y-2">
                  <p className="text-[10px] text-muted uppercase font-bold tracking-widest opacity-60">Unlocks</p>
                  <p className="text-sm text-white/90 leading-relaxed font-medium">{item.tasks}</p>
                </div>

                {/* Bounty Range */}
                <div className="pt-6 border-t border-white/[0.03]">
                  <p className="text-[10px] text-muted uppercase font-bold tracking-widest opacity-60 mb-1">Bounty Range</p>
                  <p className="text-2xl font-sans font-bold text-accent">{item.range}</p>
                </div>

                {/* Mascot Image at bottom */}
                <div className="flex-grow flex items-end justify-center pt-8">
                  <div className="relative w-full h-40 transition-transform duration-500 group-hover:scale-110">
                    <Image 
                      src={item.image} 
                      alt={item.label} 
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
