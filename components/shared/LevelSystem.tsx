import React from 'react'
import { cn } from '@/lib/utils/cn'

const LEVELS = [
  { 
    lvl: 1, 
    label: 'Newcomer', 
    tasks: 'HTML/CSS, Basic Bug Fixes', 
    range: '₹200 - ₹500', 
    isLocked: false 
  },
  { 
    lvl: 2, 
    label: 'Apprentice', 
    tasks: 'React Components, CSS Logic', 
    range: '₹500 - ₹1200', 
    isLocked: false 
  },
  { 
    lvl: 3, 
    label: 'Builder', 
    tasks: 'API Hooks, Full-stack Features', 
    range: '₹1200 - ₹3000', 
    isLocked: false,
    isActive: true 
  },
  { 
    lvl: 4, 
    label: 'Expert', 
    tasks: 'System Architecture, Database Fixes', 
    range: '₹3000 - ₹8000', 
    isLocked: true 
  },
  { 
    lvl: 5, 
    label: 'Architect', 
    tasks: 'Performance at Scale, Cloud DevOps', 
    range: '₹8000+', 
    isLocked: true 
  },
]

export default function LevelSystem() {
  return (
    <section className="py-24 px-4 bg-[var(--color-bg-surface)]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-serif text-4xl mb-4 text-[var(--color-text-primary)]">
          The Level System
        </h2>
        <p className="text-muted mb-16 max-w-2xl mx-auto">
          The more you ship, the faster you level up. Higher levels unlock bigger task budgets and exclusive bounties.
        </p>

        <div className="relative flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4 lg:gap-8 overflow-x-auto pb-8 snap-x">
          {/* Progress Line */}
          <div className="absolute top-[35px] left-8 right-8 h-1 bg-[var(--color-border)] hidden md:block" />
          
          {LEVELS.map((item, index) => (
            <div 
              key={index} 
              className={cn(
                "relative flex flex-col items-center flex-1 min-w-[200px] snap-center px-4 transition-all duration-300",
                item.isActive ? "scale-105" : "opacity-70"
              )}
            >
              {/* Dot */}
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-6 z-10 border-4",
                  item.isActive ? "bg-accent border-accent-light text-white" : "bg-white border-[var(--color-border)] text-muted"
                )}
              >
                {item.lvl}
              </div>

              {/* Card */}
              <div 
                className={cn(
                  "bg-white p-6 rounded-xl border w-full text-left space-y-3 shadow-sm",
                  item.isActive ? "border-accent ring-1 ring-accent/20" : "border-[var(--color-border)]"
                )}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[var(--color-text-primary)]">{item.label}</h4>
                  {item.isActive && <span className="text-[10px] bg-accent text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Current</span>}
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1">Unlocks</p>
                  <p className="text-sm text-[var(--color-text-primary)] h-10 line-clamp-2">{item.tasks}</p>
                </div>
                <div className="pt-2 border-t border-[var(--color-border)]">
                  <p className="text-xs text-muted mb-1 font-medium">Bounty Range</p>
                  <p className="font-mono text-accent font-bold">{item.range}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
