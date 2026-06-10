'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Button } from '@/components/ui/Button'
import DotField from '@/components/shared/DotField'
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
  ArrowRight
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
    icon: Zap
  },
  {
    title: 'Trust & Transparency',
    desc: 'Clear processes, open communication, and fair rewards.',
    icon: ShieldCheck
  },
  {
    title: 'Community',
    desc: 'We grow together. Builders, maintainers, and learners — all in one place.',
    icon: Users
  },
  {
    title: 'Keep Building',
    desc: "We're always iterating, improving, and pushing things forward.",
    icon: Rocket
  }
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


    // 3. Scroll reveals for elements
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
                <h1 className="gsap-wf-hero-title text-[2.5rem] max-[420px]:text-[2.1rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-semibold text-white leading-[1.04] tracking-[-0.04em] opacity-0">
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

      {/* --- CONTEXT STORY SECTION --- */}
      <section className="gsap-wf-section relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-white/[0.03]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="gsap-wf-element ui-eyebrow opacity-0">
            {'//'} the concept
          </div>
          <h2 className="gsap-wf-element text-4xl md:text-6xl font-semibold text-white tracking-[-0.03em] leading-tight opacity-0">
            A developer playground built to <span className="font-serif italic font-normal text-accent">prove capability.</span>
          </h2>
          <p className="gsap-wf-element text-white/50 text-base md:text-lg font-light leading-relaxed opacity-0">
            Forke was born from a simple realization: the traditional path for software engineers is broken. Building fake portfolio projects teaches you syntax, but it doesn't teach you how to ship. Bidding for freelance contracts is an endless waiting game, and early internships are heavily gatekept.
          </p>
          <p className="gsap-wf-element text-white/50 text-base md:text-lg font-light leading-relaxed opacity-0">
            We built Forke to change this. We've turned real-world software contributions into a gamified, reward-driven experience. Startups post scoped, bite-sized coding tasks with fixed budgets. You claim a task, write code in an isolated GitHub branch, submit a pull request, and get paid instantly via UPI upon approval. No resumes, no interviews, no noise — just code, growth, and cash.
          </p>
        </div>
      </section>

      {/* --- MISSION & VISION SECTION --- */}
      <section className="gsap-wf-section relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Mission Card */}
          <div className="gsap-wf-element relative rounded-3xl border border-white/[0.04] bg-[#0A0A0A] p-8 md:p-12 hover:border-[#FF7A00]/30 hover:scale-[1.02] active:scale-[0.98] group flex flex-col lg:flex-row gap-6 opacity-0 overflow-hidden text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Ambient Card Radial Spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.02)_0%,_transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />
            
            {/* Left double-ringed premium Icon Circle */}
            <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-[#FF7A00] group-hover:bg-[#FF7A00] group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-500 shrink-0 relative z-10">
              <Target className="w-7 h-7" strokeWidth={1.2} />
            </div>
            
            <div className="space-y-4 relative z-10 text-left mt-1">
              <h3 className="text-white font-bold text-xl md:text-2xl tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Our Mission</h3>
              <p className="text-sm md:text-base text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300">
                To make real-world experience accessible to every developer through meaningful work and fair opportunities.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="gsap-wf-element relative rounded-3xl border border-white/[0.04] bg-[#0A0A0A] p-8 md:p-12 hover:border-[#FF7A00]/30 hover:scale-[1.02] active:scale-[0.98] group flex flex-col lg:flex-row gap-6 opacity-0 overflow-hidden text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Ambient Card Radial Spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.02)_0%,_transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />
            
            {/* Left double-ringed premium Icon Circle */}
            <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-[#FF7A00] group-hover:bg-[#FF7A00] group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-500 shrink-0 relative z-10">
              <Eye className="w-7 h-7" strokeWidth={1.2} />
            </div>
            
            <div className="space-y-4 relative z-10 text-left mt-1">
              <h3 className="text-white font-bold text-xl md:text-2xl tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Our Vision</h3>
              <p className="text-sm md:text-base text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300">
                A world where developers grow by building, not just by learning — and where contribution is recognized and rewarded.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- VALUES SECTION --- */}
      <section className="gsap-wf-section relative z-10 py-20 px-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-left mb-16 max-w-xl">
          <div className="gsap-wf-element ui-eyebrow opacity-0 mb-4">
            {'//'} our values
          </div>
          <h2 className="gsap-wf-element text-4xl md:text-6xl font-semibold text-white tracking-[-0.03em] leading-none opacity-0">
            What drives <span className="font-serif italic font-normal text-accent">us.</span>
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((val, idx) => {
            const Icon = val.icon
            return (
              <div 
                key={idx} 
                className="gsap-wf-element relative p-6 sm:p-8 rounded-3xl border border-white/[0.04] bg-[#0A0A0A] hover:border-[#FF7A00]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-start group opacity-0 overflow-hidden text-left"
              >
                {/* Spotlight Background Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.02)_0%,_transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />
                
                {/* Premium Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-[#FF7A00] group-hover:bg-[#FF7A00] group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-500 shrink-0 mb-5 sm:mb-6 relative z-10">
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="space-y-2.5 relative z-10 text-left">
                  <h3 className="text-white font-bold text-lg md:text-xl tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">
                    {val.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300">
                    {val.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </section>



      {/* --- BOTTOM CTA VISUAL SECTION --- */}
      <section className="gsap-wf-section relative z-10 py-16 sm:py-20 px-6 max-w-7xl mx-auto mb-16">
        {/* PHONE-ONLY clean centered card (matches /levels styling) */}
        <div className="md:hidden p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/[0.04] shadow-2xl relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.06)_0%,_transparent_55%)] pointer-events-none" />
          <div className="space-y-6 relative z-10">
            <h2 className="gsap-wf-element text-3xl font-semibold text-white leading-tight tracking-[-0.03em] opacity-0">
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
              <h2 className="gsap-wf-element text-4xl lg:text-6xl font-semibold text-white leading-tight tracking-[-0.03em] opacity-0 max-w-xl">
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
