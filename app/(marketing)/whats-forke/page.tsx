'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Button } from '@/components/ui/Button'
import DotField from '@/components/shared/DotField'
import { Eyebrow } from '@/components/landing/primitives'
import {
  Code,
  Shield,
  IndianRupee,
  Target,
  Eye,
  Zap,
  Users,
  Rocket,
  ShieldCheck,
  ArrowRight,
  Check,
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

export default function WhatsForkePage() {
  const router = useRouter()
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
    .fromTo('.gsap-wf-hero-row',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      '-=0.7'
    )
    .fromTo('.gsap-wf-hero-image-wrap',
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2 },
      '-=1'
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

      {/* --- HERO WRAPPER (Confines dotted background to top section & fits viewport) --- */}
      <div className="relative w-full h-screen lg:min-h-screen lg:h-auto flex items-start lg:items-center overflow-hidden">
        {/* Ambient background Dot Grid — clear circle follows Forky (lower-center on mobile, right on desktop) */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none opacity-50
            [mask-image:radial-gradient(circle_at_50%_78%,transparent_18%,black_48%)]
            [-webkit-mask-image:radial-gradient(circle_at_50%_78%,transparent_18%,black_48%)]
            lg:[mask-image:radial-gradient(circle_at_80%_50%,transparent_15%,black_45%)]
            lg:[-webkit-mask-image:radial-gradient(circle_at_80%_50%,transparent_15%,black_45%)]"
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

        {/* --- HERO SECTION (Homepage Hero Layout & Sizing Match) --- */}
        <section className="relative z-10 w-full pt-28 pb-6 sm:pt-32 sm:pb-16 px-6 max-w-7xl mx-auto">
          <div className="max-w-7xl mx-auto w-full relative">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">

              {/* Hero Left Content */}
              <div className="space-y-10 text-center lg:text-left relative z-30 pt-8 lg:pt-0">

                {/* Small badge */}
                <div className="gsap-wf-hero-badge flex items-center justify-center lg:justify-start gap-2 opacity-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="ui-eyebrow">{'//'} about us</span>
                </div>

                {/* Headline (matches homepage hero typography) */}
                <h1 className="gsap-wf-hero-title text-[2.5rem] max-[420px]:text-[2.1rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-medium text-white leading-[1.04] tracking-[-0.04em] opacity-0">
                  What is <span className="font-serif italic font-normal text-accent">Forke?</span>
                </h1>

                {/* Description (Upscaled to text-lg md:text-xl to match homepage description) */}
                <p className="gsap-wf-hero-desc text-muted text-base max-[420px]:text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-0">
                  Forke is a gamified open-source contribution space. Claim verified coding tasks, level up your engineering tier, and cash out rewards instantly.
                </p>

                {/* Row of Three Features */}
                <div className="gsap-wf-hero-row grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-5 opacity-0 max-w-2xl mx-auto lg:mx-0">
                  {[
                    { title: 'Real tasks', desc: 'from real projects', icon: Code },
                    { title: 'Verified work', desc: 'you can be proud of', icon: Shield },
                    { title: 'Get paid', desc: 'for your impact', icon: IndianRupee },
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="p-3 sm:p-5 rounded-2xl bg-[#0A0A0A]/90 border border-white/[0.06] backdrop-blur-md flex flex-col gap-3 sm:gap-4 hover:border-white/10 transition-colors">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm md:text-base tracking-tight">{item.title}</h4>
                          <p className="text-xs text-white/40 font-light mt-1 leading-tight">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>

              {/* DESKTOP Hero Image — absolute right-side (original layout, lg+ only) */}
              <div className="hidden lg:block absolute right-[-10%] top-1/2 -translate-y-1/2 w-[55vw] h-[55vw] max-w-[850px] max-h-[850px] z-0 pointer-events-none">
                <div
                  className="gsap-wf-hero-image-wrap relative w-full h-full"
                  style={{
                    maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
                  }}
                >
                  <Image
                    src="/forke-assets/about-assets/hero-bg.png"
                    alt="Chibi Rabbit Coding at Night Rooftop"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* MOBILE Hero Image — pinned to the very bottom of the full-height hero, behind the text (md:hidden) */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 bottom-0 w-[115%] max-[420px]:w-[108%] sm:w-[min(95%,50dvh)] aspect-square z-0 pointer-events-none">
          <div
            className="relative w-full h-full"
            style={{
              maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
            }}
          >
            <Image
              src="/forke-assets/about-assets/hero-bg.png"
              alt="Chibi Rabbit Coding at Night Rooftop"
              fill
              className="object-cover"
            />
          </div>
        </div>
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
            <Eyebrow n="002" label="our values" />
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
                onClick={() => router.push('/register')}
              >
                Join the movement <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
                onClick={() => router.push('/register')}
              >
                Join the movement <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>

          {/* Right Peeking Mascot Illustration (tablet: hidden; desktop: absolute breakout) */}
          <div className="gsap-wf-element hidden lg:flex lg:w-[700px] lg:h-[700px] lg:absolute lg:right-6 lg:-top-85 justify-center relative z-10 opacity-0 select-none pointer-events-none">
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
