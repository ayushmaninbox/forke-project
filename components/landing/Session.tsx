import React from 'react'
import { Section, Eyebrow, H2 } from './primitives'
import Terminal from './Terminal'
import Reveal from './Reveal'

/**
 * The whole product in one typed terminal session — claim → checks → merge →
 * UPI payout. Sits on the blueprint grid so the artifact reads like a spec.
 */
export default function Session({ n = '002' }: { n?: string }) {
  return (
    <Section className="relative overflow-hidden px-5 py-24 md:px-10 md:py-32">
      <div aria-hidden className="ui-grid-soft absolute inset-0" />

      <div className="relative mx-auto max-w-2xl">
        <Reveal>
          <div className="flex justify-center">
            <Eyebrow n={n} label="one session" />
          </div>
          <H2 accent="merges." className="text-center">
            Money moves when code
          </H2>
        </Reveal>

        <Reveal delay={140} className="mt-12">
          <Terminal />
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-7 text-center font-mono text-[11px] tracking-wide text-white/30">
            one task, end to end — claim → checks → ai review → merge → upi
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
