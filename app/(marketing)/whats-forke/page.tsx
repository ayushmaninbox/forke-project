'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Button } from '@/components/ui/Button'
import DotField from '@/components/shared/DotField'
import { 
  GitBranch, 
  Terminal, 
  Award, 
  Zap, 
  ShieldCheck, 
  Flame, 
  ArrowRight,
  TrendingUp,
  Coins
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const BENEFIT_CARDS = [
  {
    title: 'No Resumes, No Interviews',
    desc: 'Skip the endless pipeline and client calls. Your developer Level and code submissions are your ultimate credentials.',
    icon: ShieldCheck,
    badge: 'Fair & Fast'
  },
  {
    title: 'Instant UPI Payouts',
    desc: 'Get your rewards wired directly into your bank account as soon as your contribution merges. No weekly invoice waits.',
    icon: Coins,
    badge: 'Direct Cashout',
    isHighlighted: true
  },
  {
    title: 'Gamified Dev Progression',
    desc: 'Complete bounties, build consecutive daily streaks, earn XP multipliers, and watch your developer tier grow.',
    icon: Flame,
    badge: 'RPG Progression'
  }
]

const PROGRESSION_LEVELS = [
  {
    level: 1,
    name: 'Newcomer',
    tasks: 'HTML/CSS layouts, basic UI styling, and documentation adjustments',
    range: '₹200 - ₹500',
    image: '/forke-assets/landing-assets/newcomer_forky.png',
  },
  {
    level: 2,
    name: 'Apprentice',
    tasks: 'Interactive React components, client hooks, and localized fixes',
    range: '₹500 - ₹1,200',
    image: '/forke-assets/landing-assets/apprentice_forky.png',
  },
  {
    level: 3,
    name: 'Builder',
    tasks: 'Full-stack integrations, database scripts, and REST endpoint routes',
    range: '₹1,200 - ₹3,000',
    image: '/forke-assets/landing-assets/builder_forky.png',
    isCurrent: true,
  },
  {
    level: 4,
    name: 'Expert',
    tasks: 'Complex state refactoring, backend testing layers, and performance audits',
    range: '₹3,000 - ₹8,000',
    image: '/forke-assets/landing-assets/expert_forky.png',
  },
  {
    level: 5,
    name: 'Architect',
    tasks: 'Cloud architecture systems, low-latency APIs, and scaling benchmarks',
    range: '₹8,000+',
    image: '/forke-assets/landing-assets/architect_forky.png',
  },
]

const STEP_ITEMS = [
  {
    num: '01',
    title: 'Claim Bounties',
    desc: 'Browse scoped tasks matching your level tier. Lock in the task to guarantee your claim.'
  },
  {
    num: '02',
    title: 'Ship Code via PR',
    desc: 'Work in your git fork, test code against baseline specs, and open a GitHub Pull Request.'
  },
  {
    num: '03',
    title: 'Cash Out Instantly',
    desc: 'Once the PR is verified and merged by the repository owner, payment releases to your UPI ID in minutes.'
  }
]

export default function WhatsForkePage() {
  const router = useRouter()
  const pageContainerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // 1. Entrance timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    
    tl.fromTo('.gsap-wf-hero-title', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1 }
    )
    .fromTo('.gsap-wf-hero-desc',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo('.gsap-wf-hero-buttons',
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo('.gsap-wf-mascot-hero',
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.75)' },
      '-=0.8'
    )

    // 2. Slow mascot float loop
    gsap.to('.gsap-wf-mascot-hero', {
      y: '+=12',
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    // 3. Stagger section element animations on scroll
    const sections = gsap.utils.toArray<HTMLElement>('.gsap-wf-section')
    sections.forEach((section) => {
      gsap.fromTo(section.querySelectorAll('.gsap-wf-element'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          }
        }
      )
    })

    // 4. Stagger benefits card fade-in
    gsap.fromTo('.gsap-wf-benefit-card',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gsap-wf-benefits-grid',
          start: 'top 75%',
        }
      }
    )

    // 5. Stagger simplified steps list
    gsap.fromTo('.gsap-wf-step-item',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.gsap-wf-steps-list',
          start: 'top 80%',
        }
      }
    )

    // 6. Level cards slide-in
    gsap.fromTo('.gsap-wf-level-card',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gsap-wf-levels-section',
          start: 'top 75%',
        }
      }
    )
  }, { scope: pageContainerRef })

  return (
    <div ref={pageContainerRef} className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans relative selection:bg-accent selection:text-white">
      <Navbar />

      {/* Ambient backgrounds */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none opacity-30"
        style={{
          maskImage: 'radial-gradient(circle at 50% 25%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 25%, black 20%, transparent 80%)',
        }}
      >
        <DotField
          dotRadius={1.0}
          dotSpacing={26}
          bulgeStrength={25}
          glowRadius={220}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={300}
          cursorForce={0.08}
          bulgeOnly
          gradientFrom="#FF7A00"
          gradientTo="#E66E00"
          glowColor="#050505"
        />
      </div>

      <div className="absolute top-[18%] left-[-8%] w-[45vw] h-[45vw] bg-accent/4 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[50%] right-[-10%] w-[40vw] h-[40vw] bg-accent/3 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[10%] w-[45vw] h-[45vw] bg-accent/3 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-40 pb-24 md:pt-48 md:pb-36 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">


        {/* Hero Title */}
        <h1 className="gsap-wf-hero-title font-serif text-6xl md:text-8xl text-white leading-[1.05] tracking-tight mb-8 opacity-0 max-w-4xl">
          What is <span className="text-accent text-glow italic font-normal">Forke?</span>
        </h1>

        {/* Hero Desc */}
        <p className="gsap-wf-hero-desc text-muted text-lg md:text-2xl font-light leading-relaxed max-w-2xl mx-auto mb-12 opacity-0">
          Forke is a gamified open-source contribution space. Claim verified coding tasks, level up your engineering tier, and cash out rewards instantly.
        </p>

        {/* Hero CTA buttons */}
        <div className="gsap-wf-hero-buttons flex flex-col sm:flex-row gap-5 mb-16 opacity-0 relative z-20">
          <Button 
            size="lg" 
            className="rounded-xl px-8 py-4 h-auto text-sm font-bold tracking-tight bg-gradient-to-b from-accent to-[#d97706] border-b-2 border-black/30 shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(180,83,9)] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-bg"
            onClick={() => router.push('/register?role=developer')}
          >
            Start Developer Journey
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-xl px-8 py-4 h-auto text-sm font-bold border-2 border-accent/20 text-accent hover:bg-accent/5 transition-all"
            onClick={() => router.push('/register?role=owner')}
          >
            Post a Bounty
          </Button>
        </div>

        {/* Floating Mascot */}
        <div className="gsap-wf-mascot-hero relative w-80 h-80 md:w-96 md:h-96 pointer-events-none opacity-0 select-none">
          <Image 
            src="/forke-assets/landing-assets/hero-image-forky.png" 
            alt="Forky Mascot Welcome" 
            fill
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 rounded-full bg-accent/8 blur-3xl -z-10" />
        </div>
      </section>

      {/* --- WHY FORKE SECTION (THE CORE PILLARS) --- */}
      <section className="gsap-wf-section relative z-10 py-20 border-t border-white/[0.03] px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
          <div className="gsap-wf-element inline-flex items-center gap-2 text-accent font-black tracking-widest text-xs uppercase opacity-0">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Made For Creators
          </div>
          <h2 className="gsap-wf-element font-serif text-4xl md:text-6xl text-white tracking-tight opacity-0 animate-pulse">
            The Git-Native <span className="text-accent italic font-normal">Platform</span>
          </h2>
          <p className="gsap-wf-element text-muted text-sm md:text-base font-light opacity-0">
            We removed the headaches of traditional freelance boards so you can focus entirely on writing great code.
          </p>
        </div>

        <div className="gsap-wf-benefits-grid grid md:grid-cols-3 gap-6">
          {BENEFIT_CARDS.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index} 
                className={`gsap-wf-benefit-card relative p-8 rounded-[2rem] border transition-all duration-300 z-10 flex flex-col min-h-[280px] group ${
                  benefit.isHighlighted 
                    ? 'bg-[#111111] border-accent/50 shadow-[0_0_35px_rgba(255,122,0,0.06)]' 
                    : 'bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.02]'
                }`}
              >
                {/* Header info */}
                <div className="flex justify-between items-center mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${
                    benefit.isHighlighted 
                      ? 'bg-accent/20 border-accent/40 text-accent' 
                      : 'bg-white/5 border-white/10 text-white/70'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-wider ${
                    benefit.isHighlighted 
                      ? 'bg-accent/15 text-accent' 
                      : 'bg-white/5 text-white/40'
                  }`}>
                    {benefit.badge}
                  </span>
                </div>

                {/* Typography */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-white group-hover:text-accent transition-colors tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* --- SIMPLIFIED HOW IT WORKS FLOW --- */}
      <section className="gsap-wf-section relative z-10 py-24 border-t border-white/[0.03] px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 md:gap-16 items-center">
          <div className="lg:col-span-2 space-y-6">
            <div className="gsap-wf-element inline-flex items-center gap-2 text-accent font-black tracking-widest text-xs uppercase opacity-0">
              <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Instant Work Flow
            </div>
            <h2 className="gsap-wf-element font-serif text-4xl md:text-6xl text-white tracking-tight leading-none opacity-0">
              Simple. <br />
              <span className="text-accent italic font-normal">Streamlined.</span>
            </h2>
            <p className="gsap-wf-element text-muted text-sm md:text-base leading-relaxed font-light opacity-0">
              No endless negotiations. Just grab a task, contribute code through GitHub, and get rewarded instantly.
            </p>
            <div className="gsap-wf-element p-6 rounded-2xl bg-white/[0.01] border border-white/5 backdrop-blur-md opacity-0 space-y-4">
              <h4 className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Spam-Free Sandboxes
              </h4>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                Project owners restrict task claims to developers matching the specific level tier. 
                This eliminates noise for project maintainers and ensures builders work on tasks that fit their skills.
              </p>
            </div>
          </div>

          <div className="gsap-wf-steps-list lg:col-span-3 space-y-4">
            {STEP_ITEMS.map((step, idx) => (
              <div 
                key={idx} 
                className="gsap-wf-step-item p-6 rounded-2xl bg-gradient-to-r from-white/[0.01] to-transparent border border-white/[0.03] hover:border-white/10 transition-colors flex gap-6 items-start group"
              >
                <span className="font-serif text-3xl text-accent/50 group-hover:text-accent font-bold transition-colors">
                  {step.num}
                </span>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-base tracking-tight">{step.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- RPG LEVEL SYSTEM --- */}
      <section className="gsap-wf-levels-section gsap-wf-section relative z-10 py-24 border-t border-white/[0.03] px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 md:gap-16 items-center mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="gsap-wf-element inline-flex items-center gap-2 text-accent font-black tracking-widest text-xs uppercase opacity-0">
              <Award className="w-3.5 h-3.5" /> Levelling Engine
            </div>
            <h2 className="gsap-wf-element font-serif text-4xl md:text-6xl text-white tracking-tight leading-none opacity-0">
              RPG Career <br />
              <span className="text-accent italic font-normal">Progression</span>
            </h2>
            <p className="gsap-wf-element text-muted text-sm md:text-base leading-relaxed font-light opacity-0">
              Earn XP by submitting high-quality code. Watch your character tier grow and unlock larger bounty ranges as you advance.
            </p>
          </div>

          <div className="gsap-wf-element lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-0">
            {/* Streak card */}
            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 flex items-center gap-5 shadow-[0_0_30px_rgba(255,122,0,0.06)]">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-accent fill-accent" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base tracking-tight mb-1">Streak Multipliers</h4>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  Claim and ship bounties consistently to activate XP multipliers and level up your developer rank faster.
                </p>
              </div>
            </div>

            {/* Mascot Reaction */}
            <div className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden">
                <Image src="/forke-assets/forky-reactions/thinking_forky.png" alt="Forky mascot" fill className="object-contain p-1" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base tracking-tight mb-1">Forky Companion</h4>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  Meet our chibi orange mascot who tracks your coding progress, cheers you on, and reacts dynamically to your streak gains.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Levels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PROGRESSION_LEVELS.map((lvl) => (
            <div 
              key={lvl.level} 
              className={`gsap-wf-level-card relative rounded-2xl border p-6 pt-7 pb-8 flex flex-col group min-h-[400px] overflow-hidden ${
                lvl.isCurrent 
                  ? 'bg-[#111111] border-accent/50 shadow-[0_0_40px_rgba(255,122,0,0.1)]' 
                  : 'bg-gradient-to-b from-[#151515] to-[#0d0d0d] border-white/[0.04]'
              }`}
            >
              {/* Card light overlay */}
              {lvl.isCurrent && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.1)_0%,_transparent_60%)] pointer-events-none" />
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Level {lvl.level}</span>
                {lvl.isCurrent && (
                  <span className="text-[8px] bg-accent/15 border border-accent/40 text-accent px-2 py-0.5 rounded font-black tracking-widest uppercase">
                    Your Tier
                  </span>
                )}
              </div>

              {/* Level name */}
              <h3 className="text-white font-serif text-2xl tracking-tight mb-4 relative z-10 group-hover:text-accent transition-colors">
                {lvl.name}
              </h3>

              {/* Task unlock description */}
              <div className="mb-4 relative z-10">
                <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest mb-1">Unlocks</p>
                <p className="text-xs text-white/70 leading-relaxed font-light min-h-[36px]">{lvl.tasks}</p>
              </div>

              {/* Payout range */}
              <div className="mb-4 relative z-10">
                <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest mb-0.5">Bounty Ranges</p>
                <p className="text-lg font-bold text-accent">{lvl.range}</p>
              </div>

              {/* Mascot breaks out bottom */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[140%] h-60 pointer-events-none select-none">
                <div className={`relative w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                  lvl.level % 2 === 0 ? '-scale-x-100' : ''
                }`}>
                  <Image 
                    src={lvl.image} 
                    alt={lvl.name} 
                    fill
                    className="object-contain object-bottom"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- ACTION CTA BOTTOM --- */}
      <section className="gsap-wf-section relative z-10 py-24 md:py-32 border-t border-white/[0.03] px-6 max-w-5xl mx-auto text-center">
        <div className="space-y-8 max-w-3xl mx-auto">
          <h2 className="gsap-wf-element font-serif text-5xl md:text-7xl text-white tracking-tight leading-tight opacity-0">
            Ready to <span className="text-accent italic font-normal">start shipping</span> code?
          </h2>
          <p className="gsap-wf-element text-muted text-base md:text-xl font-light leading-relaxed max-w-xl mx-auto opacity-0">
            Create your account today, claim a bounty matching your level, and start earning instantly.
          </p>
          <div className="gsap-wf-element flex flex-col sm:flex-row gap-5 justify-center pt-4 opacity-0">
            <Button 
              size="lg" 
              className="rounded-xl px-10 py-4 h-auto text-sm font-bold tracking-tight bg-gradient-to-b from-accent to-[#d97706] border-b-2 border-black/30 shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(180,83,9)] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-bg"
              onClick={() => router.push('/register?role=developer')}
            >
              Get Started Now <ArrowRight className="ml-2 w-4 h-4 inline-block" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-xl px-10 py-4 h-auto text-sm font-bold border-2 border-accent/20 text-accent hover:bg-accent/5 transition-all"
              onClick={() => router.push('/register?role=owner')}
            >
              Post a Task
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
