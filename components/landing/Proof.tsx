'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  Coins,
  Crosshair,
  ExternalLink,
  Lock,
  Star,
  Swords,
  Trophy,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import dynamic from 'next/dynamic'
import { Section, Eyebrow, H2 } from './primitives'
import Reveal from './Reveal'
import { useWaitlisterView } from './useWaitlisterView'

const Lanyard = dynamic(() => import('@/components/profile/Lanyard'), {
  ssr: false,
})

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

/**
 * Proof of work — a faded snippet of the real public profile page, framed like
 * a SaaS product screenshot. The hero of the frame is the actual lanyard DEV ID
 * card from the live profile page, loaded with (very) fake data.
 */

const SHIPPED = [
  {
    title: 'Fix telemetry overflow on launch dashboard',
    rating: '5.0',
    tags: ['react', 'bug fix'],
    amount: '₹2,400',
    date: '8 Jun',
  },
  {
    title: 'Migrate rover fleet API to App Router',
    rating: '4.9',
    tags: ['next.js', 'typescript'],
    amount: '₹3,000',
    date: '2 Jun',
  },
  {
    title: 'Patch OAuth loop in mission control',
    rating: '5.0',
    tags: ['auth', 'security'],
    amount: '₹800',
    date: '26 May',
  },
  {
    title: 'Add rate limiting to booster booking API',
    rating: '5.0',
    tags: ['node.js'],
    amount: '₹1,100',
    date: '19 May',
  },
]

const ACHIEVEMENTS = [
  { icon: Swords, name: 'First Blood', desc: 'Complete your first task', unlocked: true },
  { icon: Crosshair, name: 'Bug Hunter', desc: 'Fix 10 bug-tagged tasks', unlocked: true },
  { icon: Coins, name: 'Loot Goblin', desc: 'Earn ₹10,000 total', unlocked: true },
  { icon: Lock, name: 'Streak God', desc: '30-day login streak', unlocked: false },
]

function ShippedPanel() {
  return (
    <div className="pointer-events-none select-none space-y-4" aria-hidden>
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="flex items-center gap-2 font-mono text-[12px] font-black uppercase tracking-wider text-white">
            <Trophy className="h-4 w-4 text-accent" /> Shipped Work
          </p>
          <span className="font-mono text-[10.5px] text-white/30">verified · timestamped · github-linked</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {SHIPPED.map((task) => (
            <div key={task.title} className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[13.5px] font-medium text-white/95">{task.title}</p>
                  <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-bold text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {task.rating}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span key={tag} className="rounded border border-white/[0.06] bg-white/[0.02] px-1.5 py-0.5 text-[10px] font-semibold text-white/40">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-[13.5px] font-black text-accent">{task.amount}</span>
                <span className="hidden h-7 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 text-[11px] font-bold text-white/70 sm:flex">
                  <GithubIcon className="h-3 w-3" /> PR <ExternalLink className="h-2.5 w-2.5" />
                </span>
                <span className="hidden font-mono text-[10.5px] text-white/20 md:block">{task.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="flex items-center gap-2 font-mono text-[12px] font-black uppercase tracking-wider text-white">
            <Award className="h-4 w-4 text-accent" /> Achievements
          </p>
          <span className="font-mono text-[10.5px] text-white/30">19 / 24 unlocked</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.name}
              className={`flex items-start gap-2.5 rounded-xl border p-3 ${
                a.unlocked ? 'border-white/[0.07] bg-white/[0.02]' : 'border-white/[0.04] bg-transparent opacity-45'
              }`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                a.unlocked ? 'border-accent/25 bg-accent/10 text-accent' : 'border-white/10 bg-white/[0.03] text-white/35'
              }`}>
                <a.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-bold text-white/90">{a.name}</span>
                <span className="mt-0.5 block text-[10px] leading-tight text-white/35">{a.desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Proof({ n = '004' }: { n?: string }) {
  const showWaitlisterView = useWaitlisterView()
  const wrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Same Linear-style flatten-on-scroll as the terminal
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(
      frameRef.current,
      { rotateX: 13, y: 64, scale: 0.96, opacity: 0.5, transformPerspective: 1200 },
      {
        rotateX: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: frameRef.current,
          start: 'top 95%',
          end: 'top 45%',
          scrub: 0.5,
        },
      }
    )
  }, { scope: wrapRef })

  return (
    <Section id="proof" className="overflow-hidden px-5 pb-10 pt-16 md:px-10 md:pb-16 md:pt-24">
      <div ref={wrapRef}>
        <Reveal>
          <Eyebrow n={n} label="proof of work" />
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <H2 accent="compiles.">A resume that</H2>
            <p className="max-w-md pb-1.5 text-[15px] font-light leading-relaxed text-white/45">
              Every approved task lands on your public profile automatically —
              timestamped, client-rated, linked to the merged PR. Recruiters
              don&apos;t read claims. They read receipts.
            </p>
          </div>
          <Link
            href={showWaitlisterView ? '/' : '/register'}
            className="group mt-6 inline-flex items-center gap-2 text-[14.5px] font-medium text-white/75 transition-colors hover:text-white"
          >
            {showWaitlisterView ? 'Coming soon' : 'Claim your username'}
            <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        {/* The artifact: the live profile page — DEV ID card and all — framed
            like a screenshot and dissolving at the fold */}
        <div className="relative mt-14 flex justify-center w-full" style={{ perspective: '1200px' }}>
          <div aria-hidden className="absolute -inset-x-12 top-10 h-56 rounded-full bg-accent/[0.05] blur-[110px]" />
          
          {/* Proportional Scaling Bounding Box */}
          <div
            style={{
              width: 'var(--lanyard-wrapper-width, calc(1200px * var(--lanyard-scale)))',
              height: 'var(--lanyard-wrapper-height, calc(540px * var(--lanyard-scale)))'
            }}
            className="relative overflow-hidden shrink-0 lg:[--lanyard-wrapper-width:100%] lg:[--lanyard-wrapper-height:auto] lg:overflow-visible lg:shrink-0"
          >
            {/* Scaled element container */}
            <div
              style={{
                transform: 'var(--lanyard-transform, scale(var(--lanyard-scale)))',
                transformOrigin: 'top left',
                width: 'var(--lanyard-width, 1200px)',
                height: 'var(--lanyard-height, 540px)'
              }}
              className="absolute left-0 top-0 lg:relative lg:[--lanyard-transform:none] lg:[--lanyard-width:100%] lg:[--lanyard-height:540px]"
            >
              <div
                ref={frameRef}
                className="w-full h-full overflow-hidden rounded-t-2xl border border-b-0 border-white/[0.09] bg-[#060608] shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#09090b] px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-4 flex items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/45">
                    <Lock className="h-3 w-3 text-emerald-400/70" />
                    forke.space/<span className="text-white/80">elonmusk</span>
                  </span>
                </div>

                {/* Page body — the real lanyard ID card next to the shipped-work ledger */}
                <div className="bg-[#060608] px-6 pt-5">
                  <div className="grid gap-6 grid-cols-[360px_1fr]">
                    <div className="h-[470px]">
                      <Lanyard
                        card={{
                          name: "Elon Musk",
                          username: "elonmusk",
                          level: 25,
                          title: "Forke Legend",
                          headline: "Ships rockets by day, merges PRs by night.",
                          avatarUrl: "/forke-assets/landing-assets/elon-musk.jpg"
                        }}
                        qrUrl="https://forke.space"
                        isHome={true}
                        position={[0, -2, 12.8]}
                      />
                    </div>
                    <div>
                      <ShippedPanel />
                    </div>
                  </div>
                </div>
                
                {/* Bottom gradient dissolve overlay */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#060608] to-transparent pointer-events-none z-[150]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
