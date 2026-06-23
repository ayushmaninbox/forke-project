'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { useWaitlisterView } from '@/components/landing/useWaitlisterView'
import { Button } from '@/components/ui/Button'
import DotField from '@/components/shared/DotField'
import { Eyebrow } from '@/components/landing/primitives'
import {
  Target,
  Eye,
  Zap,
  Users,
  Rocket,
  ShieldCheck,
  ArrowRight,
  Check,
  Minus,
  MousePointerClick,
  GitBranch,
  GitPullRequest,
  Wallet,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const VALUES = [
  {
    title: 'Impact First',
    desc: 'We focus on meaningful contributions that create real impact.',
    icon: Zap,
  },
  {
    title: 'Trust & Transparency',
    desc: 'Clear processes, open communication, and fair rewards.',
    icon: ShieldCheck,
  },
  {
    title: 'Community',
    desc: 'We grow together. Builders, maintainers, and learners — all in one place.',
    icon: Users,
  },
  {
    title: 'Keep Building',
    desc: "We're always iterating, improving, and pushing things forward.",
    icon: Rocket,
  },
]

const STORY_POINTS = [
  'No resumes — your merged PRs speak',
  'No interviews — levels are earned, not claimed',
  'No proposals — claim a task and start',
  'No waiting — UPI payout the moment it merges',
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Claim a task',
    desc: 'Browse a feed gated to your level, skill tier, and trust score. Claim one that fits and the soft reservation is yours.',
    icon: MousePointerClick,
  },
  {
    step: '02',
    title: 'Build in a branch',
    desc: 'Work in an isolated, Forke-managed GitHub branch — never directly on the owner’s repo. Just code.',
    icon: GitBranch,
  },
  {
    step: '03',
    title: 'Ship a pull request',
    desc: 'Open a PR with a structured submission. Automated checks and an AI review run before the owner ever sees it.',
    icon: GitPullRequest,
  },
  {
    step: '04',
    title: 'Get paid instantly',
    desc: 'Owner approves the verdict, Forke merges upstream, and your UPI payout releases the moment it lands.',
    icon: Wallet,
  },
]

// status: 'yes' | 'no' | 'partial' — drives the check / cross / partial markers.
const COMPARISON_COLUMNS = ['Forke', 'Fiverr', 'Upwork'] as const

const COMPARISON = [
  { feature: 'Bite-sized micro-tasks (30 min – 4 hr)', forke: 'yes', fiverr: 'partial', upwork: 'no' },
  { feature: 'Developer-only marketplace', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'Skill-gated task access', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'Instant UPI payouts on approval', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'Auto-built, verified GitHub portfolio', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'Git-native PR submission workflow', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'AI-assisted code review pipeline', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'Escrow held before work begins', forke: 'yes', fiverr: 'partial', upwork: 'partial' },
  { feature: 'No proposals or bidding wars', forke: 'yes', fiverr: 'partial', upwork: 'no' },
  { feature: 'India-first ₹ pricing & startups', forke: 'yes', fiverr: 'no', upwork: 'no' },
] as const

// Renders the check / cross / partial marker for a comparison cell.
function renderMark(status: 'yes' | 'no' | 'partial', highlight: boolean) {
  if (status === 'yes') {
    return (
      <span
        className={`flex items-center justify-center rounded-full ${
          highlight
            ? 'h-7 w-7 bg-accent text-black shadow-[0_0_12px_-4px_rgba(255,122,0,0.6)]'
            : 'h-6 w-6 bg-white/[0.07] text-white/55'
        }`}
      >
        <Check className={highlight ? 'h-4 w-4' : 'h-3.5 w-3.5'} strokeWidth={highlight ? 3.25 : 2.5} />
      </span>
    )
  }
  if (status === 'partial') {
    return (
      <span className="rounded-full border border-amber-500/30 bg-amber-500/[0.08] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-400/90">
        Partial
      </span>
    )
  }
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.03]">
      <Minus className="h-3.5 w-3.5 text-white/20" strokeWidth={2.5} />
    </span>
  )
}

export default function WhatsForkePage() {
  const router = useRouter()
  const showWaitlisterView = useWaitlisterView()
  // Route the primary CTA to the waitlist while the lock is on (sign-up is
  // closed and /register 404s then); otherwise send people to register.
  const primaryCtaHref = showWaitlisterView ? '/waitlist' : '/register'
  const pageContainerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // 1. Entrance timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo('.gsap-wf-hero-badge',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo('.gsap-wf-hero-title',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.6'
    )
    .fromTo('.gsap-wf-hero-desc',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )

    // 2. Scroll reveals for elements
    const sections = gsap.utils.toArray<HTMLElement>('.gsap-wf-section')
    sections.forEach((section) => {
      gsap.fromTo(section.querySelectorAll('.gsap-wf-element'),
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          }
        }
      )
    })
  }, { scope: pageContainerRef })

  return (
    <div ref={pageContainerRef} className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans relative selection:bg-accent selection:text-white">
      <Navbar />

      {/* --- HERO SECTION WITH SCALED DOTTED BACKGROUND --- */}
      <div className="relative w-full overflow-hidden">
        {/* Ambient background Dot Grid */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none opacity-50"
          style={{
            maskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 45%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 45%)',
          }}
        >
          <DotField
            dotRadius={1.2}
            dotSpacing={22}
            bulgeStrength={45}
            glowRadius={150}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={350}
            cursorForce={0.1}
            bulgeOnly
            gradientFrom="#FF7A00"
            gradientTo="#E66E00"
            glowColor="#050505"
          />
        </div>

        <section className="relative z-10 pt-48 pb-20 md:pt-56 md:pb-28 px-6 max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8 relative z-30">
            {/* Small badge */}
            <div className="gsap-wf-hero-badge flex items-center justify-center gap-2 opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="ui-eyebrow">{'//'} about us</span>
            </div>

            {/* Headline */}
            <h1 className="gsap-wf-hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-white leading-[1.02] tracking-[-0.04em] opacity-0">
              What is <span className="font-serif italic font-normal text-accent">Forke?</span>
            </h1>

            {/* Description */}
            <p className="gsap-wf-hero-desc text-white/50 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto opacity-0">
              Forke is a gamified open-source contribution space. Claim verified coding tasks, level up your engineering tier, and cash out rewards instantly.
            </p>
          </div>
        </section>
      </div>

      {/* --- THE STORY — editorial split: statement left, narrative right --- */}
      <section className="gsap-wf-section relative z-10 py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <div className="gsap-wf-element opacity-0">
              <Eyebrow n="001" label="the concept" />
            </div>
            <h2 className="gsap-wf-element mt-5 text-4xl md:text-[3.25rem] font-medium text-white tracking-[-0.035em] leading-[1.06] opacity-0">
              Fake projects don&apos;t teach you to{' '}
              <span className="font-serif italic font-normal text-accent">ship.</span>
            </h2>
            <p className="gsap-wf-element mt-6 font-mono text-[11px] tracking-wide text-white/30 opacity-0">
              {'//'} prove skill by shipping
            </p>
          </div>

          <div className="space-y-6">
            <p className="gsap-wf-element text-white/55 text-base md:text-lg font-light leading-relaxed opacity-0">
              Forke was born from a simple realization: the traditional path for software
              engineers is broken. Building fake portfolio projects teaches you syntax, but it
              doesn&apos;t teach you how to ship. Bidding for freelance contracts is an endless
              waiting game, and early internships are heavily gatekept.
            </p>
            <p className="gsap-wf-element text-white/55 text-base md:text-lg font-light leading-relaxed opacity-0">
              We built Forke to change this. Startups post scoped, bite-sized coding tasks with
              fixed budgets. You claim a task, write code in an isolated GitHub branch, submit a
              pull request, and get paid instantly via UPI upon approval. Just code, growth, and
              cash.
            </p>
            <ul className="gsap-wf-element space-y-3 pt-2 opacity-0">
              {STORY_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[14.5px] text-white/65">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS — four-step ledger flow --- */}
      <section className="gsap-wf-section relative z-10 pb-24 md:pb-32 px-6 max-w-7xl mx-auto">
        <div className="text-left mb-14 max-w-xl">
          <div className="gsap-wf-element opacity-0">
            <Eyebrow n="002" label="how it works" />
          </div>
          <h2 className="gsap-wf-element mt-5 text-4xl md:text-[3.25rem] font-medium text-white tracking-[-0.035em] leading-[1.06] opacity-0">
            Claim. Build. <span className="font-serif italic font-normal text-accent">Ship.</span>
          </h2>
          <p className="gsap-wf-element mt-5 text-white/50 text-base md:text-lg font-light leading-relaxed opacity-0">
            From browsing the feed to money in your account — the whole loop is Git-native and built for speed.
          </p>
        </div>

        <div className="gsap-wf-element grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4 opacity-0">
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.step} className="group bg-[#070708] p-7 transition-colors hover:bg-[#0b0b0d] sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/[0.06] text-accent transition-all duration-500 group-hover:bg-accent group-hover:text-black">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-xs tracking-widest text-white/25">{item.step}</span>
                </div>
                <h3 className="mt-5 text-lg font-medium tracking-[-0.01em] text-white">{item.title}</h3>
                <p className="mt-2 text-[13px] font-light leading-relaxed text-white/45">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* --- MISSION & VISION — one ledger bento --- */}
      <section className="gsap-wf-section relative z-10 px-6 max-w-7xl mx-auto">
        <div className="gsap-wf-element grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-2 opacity-0">
          {[
            {
              icon: Target,
              title: 'Our Mission',
              copy: 'To make real-world experience accessible to every developer through meaningful work and fair opportunities.',
            },
            {
              icon: Eye,
              title: 'Our Vision',
              copy: 'A world where developers grow by building, not just by learning — and where contribution is recognized and rewarded.',
            },
          ].map((item) => (
            <div key={item.title} className="group bg-[#070708] p-8 transition-colors hover:bg-[#0b0b0d] md:p-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/25 bg-accent/[0.06] text-accent transition-all duration-500 group-hover:bg-accent group-hover:text-black">
                <item.icon className="h-6 w-6" strokeWidth={1.4} />
              </div>
              <h3 className="mt-6 text-xl font-medium tracking-[-0.02em] text-white md:text-2xl">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-white/45 md:text-[15px]">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- VALUES — four-cell ledger bento --- */}
      <section className="gsap-wf-section relative z-10 py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="text-left mb-14 max-w-xl">
          <div className="gsap-wf-element opacity-0">
            <Eyebrow n="003" label="our values" />
          </div>
          <h2 className="gsap-wf-element mt-5 text-4xl md:text-[3.25rem] font-medium text-white tracking-[-0.035em] leading-[1.06] opacity-0">
            What drives <span className="font-serif italic font-normal text-accent">us.</span>
          </h2>
        </div>

        <div className="gsap-wf-element grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4 opacity-0">
          {VALUES.map((val) => {
            const Icon = val.icon
            return (
              <div key={val.title} className="group bg-[#070708] p-7 transition-colors hover:bg-[#0b0b0d] sm:p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/[0.06] text-accent transition-all duration-500 group-hover:bg-accent group-hover:text-black">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-lg font-medium tracking-[-0.01em] text-white">{val.title}</h3>
                <p className="mt-2 text-[13px] font-light leading-relaxed text-white/45">{val.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* --- WHY NOT FIVERR — comparison ledger --- */}
      <section className="gsap-wf-section relative z-10 pb-24 md:pb-32 px-6 max-w-7xl mx-auto">
        <div className="text-left mb-14 max-w-xl">
          <div className="gsap-wf-element opacity-0">
            <Eyebrow n="004" label="why not fiverr" />
          </div>
          <h2 className="gsap-wf-element mt-5 text-4xl md:text-[3.25rem] font-medium text-white tracking-[-0.035em] leading-[1.06] opacity-0">
            Built different, on <span className="font-serif italic font-normal text-accent">purpose.</span>
          </h2>
          <p className="gsap-wf-element mt-5 text-white/50 text-base md:text-lg font-light leading-relaxed opacity-0">
            Generic freelance platforms weren&apos;t made for developers. Every choice here is.
          </p>
        </div>

        <div className="gsap-wf-element relative opacity-0">
          {/* Ambient glow behind the table, gently concentrated under the Forke column */}
          <div className="pointer-events-none absolute -inset-x-10 -top-4 bottom-0 hidden sm:block">
            <div className="absolute left-1/2 top-0 h-full w-[30%] -translate-x-[18%] rounded-full bg-accent/[0.035] blur-3xl" />
          </div>

          {/* Highlighted Forke column — aligned flush with the table box (no overhang).
              Grid is 2fr 1fr 1fr 1fr → feature 40%, each platform 20%; Forke is the first platform (40%–60%). */}
          <div className="pointer-events-none absolute inset-y-0 left-[40%] right-[40%] z-20 hidden rounded-2xl border border-accent/30 bg-gradient-to-b from-accent/[0.07] via-accent/[0.03] to-transparent shadow-[0_0_50px_-24px_rgba(255,122,0,0.4)] sm:block" />

          <div className="relative z-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0b]/80 backdrop-blur-sm">
            {/* Header row */}
            <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] border-b border-white/[0.08] sm:grid-cols-[2fr_1fr_1fr_1fr]">
              <div className="flex items-end px-4 py-5 font-mono text-[11px] uppercase tracking-widest text-white/35 sm:px-6 sm:py-6">
                Feature
              </div>
              {COMPARISON_COLUMNS.map((col) => {
                const isForke = col === 'Forke'
                return (
                  <div key={col} className="flex flex-col items-center justify-end px-2 py-5 text-center sm:px-4 sm:py-6">
                    {isForke ? (
                      <span className="text-base font-semibold tracking-[-0.04em] text-white sm:text-lg">
                        forke<span className="text-accent">*</span>
                      </span>
                    ) : (
                      <div className="text-sm font-bold tracking-tight text-white/45 sm:text-base">{col}</div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Feature rows */}
            {COMPARISON.map((row, idx) => (
              <div
                key={row.feature}
                className={`group/row grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center transition-colors hover:bg-white/[0.02] sm:grid-cols-[2fr_1fr_1fr_1fr] ${
                  idx !== 0 ? 'border-t border-white/[0.05]' : ''
                }`}
              >
                <div className="px-4 py-4 text-[13px] font-medium leading-snug text-white/75 transition-colors group-hover/row:text-white sm:px-6 sm:py-5 sm:text-[15px]">
                  {row.feature}
                </div>
                <div className="flex justify-center px-2 py-4 sm:px-4 sm:py-5">{renderMark(row.forke, true)}</div>
                <div className="flex justify-center px-2 py-4 sm:px-4 sm:py-5">{renderMark(row.fiverr, false)}</div>
                <div className="flex justify-center px-2 py-4 sm:px-4 sm:py-5">{renderMark(row.upwork, false)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BOTTOM CTA VISUAL SECTION --- */}
      <section className="gsap-wf-section relative z-10 pb-24 px-6 max-w-7xl mx-auto">
        {/* PHONE-ONLY clean centered card (matches /levels styling) */}
        <div className="md:hidden p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/[0.04] shadow-2xl relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.06)_0%,_transparent_55%)] pointer-events-none" />
          <div className="space-y-6 relative z-10">
            <h2 className="gsap-wf-element text-3xl font-medium text-white leading-tight tracking-[-0.03em] opacity-0">
              This is just the <span className="font-serif italic font-normal text-accent">beginning.</span>
            </h2>
            <p className="gsap-wf-element text-white/50 text-sm leading-relaxed font-light opacity-0">
              Join the movement and help us build the future of developer work.
            </p>
            <div className="gsap-wf-element flex justify-center opacity-0">
              <Button
                size="lg"
                className="group h-12 px-7 py-0 gap-2 rounded-lg bg-accent hover:bg-accent-hover text-[#0a0a0a] text-[15px] font-semibold tracking-tight shadow-none transition-colors flex items-center justify-center"
                onClick={() => router.push(primaryCtaHref)}
              >
                {showWaitlisterView ? 'Join the waitlist' : 'Join the movement'} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* TABLET + DESKTOP — original card with mascot (tablet = scaled-down side-by-side, desktop unchanged) */}
        <div className="hidden md:flex p-8 md:p-10 lg:p-14 rounded-[3.5rem] bg-[#0a0a0a] border border-white/[0.04] shadow-2xl relative overflow-x-clip overflow-y-visible flex-row items-center gap-6 lg:gap-12 group">

          {/* Ambient card highlight background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_rgba(255,122,0,0.05)_0%,_transparent_60%)] pointer-events-none" />

          {/* Left Text / CTAs */}
          <div className="w-full lg:w-7/12 space-y-6 lg:space-y-8 relative z-10 text-left">
            <div className="space-y-4">
              <h2 className="gsap-wf-element text-4xl lg:text-6xl font-medium text-white leading-tight tracking-[-0.03em] opacity-0 max-w-xl">
                This is just the <span className="font-serif italic font-normal text-accent">beginning.</span>
              </h2>
              <p className="gsap-wf-element text-white/50 text-base lg:text-lg leading-relaxed font-light opacity-0 max-w-xl">
                Join the movement and help us build the future of developer work.
              </p>
            </div>
            <div className="gsap-wf-element flex flex-col sm:flex-row gap-4 opacity-0">
              <Button
                size="lg"
                className="group h-12 px-7 py-0 gap-2 rounded-lg bg-accent hover:bg-accent-hover text-[#0a0a0a] text-[15px] font-semibold tracking-tight shadow-none transition-colors flex items-center justify-center"
                onClick={() => router.push(primaryCtaHref)}
              >
                {showWaitlisterView ? 'Join the waitlist' : 'Join the movement'} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>

          {/* Right Peeking Mascot Illustration (tablet: hidden; desktop: absolute breakout) */}
          <div className="gsap-wf-element hidden lg:flex lg:w-[700px] lg:h-[700px] lg:absolute lg:right-6 lg:-top-64 justify-center relative z-10 opacity-0 select-none pointer-events-none">
            <div
              className="relative w-full max-w-none lg:w-full lg:h-full aspect-square lg:aspect-auto"
              style={{
                maskImage: 'radial-gradient(circle at center, black 45%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 45%, transparent 85%)',
              }}
            >
              <Image
                src="/forke-assets/about-assets/bottom-hero.png"
                alt="Focused Rabbit Mascot Over Screen"
                fill
                className="object-contain lg:object-bottom"
              />
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
