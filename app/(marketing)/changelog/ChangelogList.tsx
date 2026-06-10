'use client'

import React, { useMemo, useState } from 'react'
import type { ChangelogDay, ChangeKind } from '@/lib/changelog'

const KIND_STYLES: Record<ChangeKind, string> = {
  feature: 'text-accent',
  fix: 'text-emerald-400',
  polish: 'text-violet-400',
  refactor: 'text-cyan-400',
  perf: 'text-amber-400',
  docs: 'text-blue-400',
  chore: 'text-white/40',
  update: 'text-white/40',
}

// Show roughly this many entries up front, then this many more per click.
// Days are always revealed whole so a date group never renders half-empty.
const INITIAL_ENTRIES = 8
const STEP = 10

export default function ChangelogList({ days }: { days: ChangelogDay[] }) {
  const totalEntries = useMemo(() => days.reduce((n, d) => n + d.entries.length, 0), [days])
  const [target, setTarget] = useState(INITIAL_ENTRIES)

  const visibleDays = useMemo(() => {
    const out: ChangelogDay[] = []
    let count = 0
    for (const day of days) {
      if (count >= target) break
      out.push(day)
      count += day.entries.length
    }
    return out
  }, [days, target])

  const shownEntries = visibleDays.reduce((n, d) => n + d.entries.length, 0)
  const remaining = totalEntries - shownEntries

  return (
    <div>
      {visibleDays.map((day, dayIndex) => (
        <section
          key={day.date}
          className="border-t border-white/[0.06] py-10 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <div className="flex items-baseline justify-between mb-5 font-mono text-[11px] tracking-wide">
            <span className="text-white/45">
              {String(dayIndex + 1).padStart(2, '0')} — {day.label}
            </span>
            <span className="text-white/25">
              {day.entries.length} {day.entries.length === 1 ? 'shipment' : 'shipments'}
            </span>
          </div>

          <div className="space-y-4">
            {day.entries.map((entry) => (
              <article
                key={entry.shortHash}
                className="group relative rounded-2xl border border-white/[0.04] bg-[#0A0A0A] p-6 hover:border-[#FF7A00]/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden text-left"
              >
                {/* Accent glow on hover */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,_rgba(255,122,0,0.025)_0%,_transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
                
                <div className="flex items-start justify-between gap-4">
                  <span className={`font-mono text-[11px] font-semibold tracking-wide ${KIND_STYLES[entry.kind]}`}>
                    {entry.kind}
                    {entry.scope ? <span className="text-white/30"> / {entry.scope}</span> : null}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/20 group-hover:text-white/40 transition-colors shrink-0">
                    <span className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5">{entry.shortHash}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline truncate max-w-[120px]">{entry.author.toLowerCase()}</span>
                  </span>
                </div>
                
                <h3 className="mt-3 text-[15px] md:text-base font-medium tracking-[-0.01em] text-white/90 group-hover:text-white leading-snug transition-colors">
                  {entry.title}
                </h3>
              </article>
            ))}
          </div>
        </section>
      ))}

      {remaining > 0 && (
        <div className="pt-12 pb-6 flex justify-center">
          <button
            onClick={() => setTarget((t) => t + STEP)}
            className="group inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-accent hover:border-accent hover:text-black font-semibold text-xs text-white/80 transition-all duration-300 cursor-pointer shadow-lg shadow-black/10 hover:shadow-accent/20"
          >
            Load more <span className="opacity-45 group-hover:opacity-70 font-mono font-medium text-[10px]">({remaining} remaining)</span>
            <span className="text-accent group-hover:text-black group-hover:translate-y-0.5 transition-transform">↓</span>
          </button>
        </div>
      )}
    </div>
  )
}
