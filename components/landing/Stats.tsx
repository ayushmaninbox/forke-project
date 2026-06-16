import React from 'react'
import { Section } from './primitives'
import Reveal from './Reveal'

// Product facts, not traction claims — every number here is a design guarantee.
const STATS = [
  { value: '30m–4h', label: 'scoped task size', sub: 'bite-sized by design' },
  { value: '<60s', label: 'merge → UPI payout', sub: 'escrow releases on merge' },
  { value: '4-layer', label: 'review pipeline', sub: 'build · tests · ai · human' },
  { value: '25', label: 'levels to climb', sub: 'newcomer → forke legend' },
]

export default function Stats() {
  return (
    <Section>
      <div className="grid grid-cols-2 gap-px bg-white/[0.06] lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="bg-[#050505] transition-colors hover:bg-[#0a0a0c]">
            <Reveal delay={i * 90} className="px-6 py-8 md:px-9 md:py-10">
              <p className="font-mono text-2xl font-semibold tracking-tight text-white tabular-nums md:text-[1.9rem]">
                {stat.value}
              </p>
              <p className="mt-2 text-[13px] text-white/55">{stat.label}</p>
              <p className="mt-1 font-mono text-[10.5px] text-white/25">{stat.sub}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </Section>
  )
}
