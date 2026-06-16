'use client'

import React, { useRef, useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import DotField from '@/components/shared/DotField'
import { Mail, Clock, Plus, AlertCircle, ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

const SUPPORT_FAQS = [
  {
    q: 'How long does payout validation take?',
    a: 'Bounty verification and payout are automated. Once a pull request is merged, the escrowed bounty is released instantly to your registered UPI ID. Validation typically finishes within seconds of the merge.',
  },
  {
    q: 'How do task disputes work?',
    a: 'If your submission is rejected, you can raise a dispute via this portal. A senior auditor will review the task specification against your PR, tests, and diff to issue a neutral verdict.',
  },
  {
    q: 'Can I claim multiple tasks at the same time?',
    a: 'To prevent hoarding, developers can only claim one active task at a time. Completing tasks successfully builds your trust score, which eventually unlocks parallel claims.',
  },
  {
    q: 'What if I miss the 20-minute activation window?',
    a: 'If you claim a task but do not start working within 20 minutes, the claim expires and the task returns to the public queue. This keeps the platform fast and fair.',
  },
]

export default function ContactPage() {
  const pageContainerRef = useRef<HTMLDivElement>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useGSAP(() => {
    // Initial entrance animation
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    
    tl.fromTo('.gsap-contact-badge', 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo('.gsap-contact-title', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1 },
      '-=0.6'
    )
    .fromTo('.gsap-contact-desc',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )

    // Stagger layout blocks with ScrollTrigger
    gsap.fromTo('.gsap-contact-block',
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gsap-contact-grid',
          start: 'top 85%',
        }
      }
    )
  }, { scope: pageContainerRef })

  return (
    <div ref={pageContainerRef} className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans relative selection:bg-accent selection:text-white">
      <Navbar />

      {/* Ambient background Dot Grid */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none opacity-40"
        style={{
          maskImage: 'radial-gradient(circle at 50% 30%, transparent 10%, black 70%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 30%, transparent 10%, black 70%)',
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

      {/* Header */}
      <header className="relative z-10 pt-36 md:pt-44 pb-12 px-6 max-w-6xl mx-auto text-center space-y-4">
        <div className="gsap-contact-badge flex items-center justify-center gap-2 opacity-0">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="ui-eyebrow">{'//'} support & social portal</span>
        </div>
        <h1 className="gsap-contact-title text-5xl md:text-7xl font-medium text-white tracking-[-0.04em] leading-[1.02] opacity-0">
          Get in touch with <span className="font-serif italic font-normal text-accent">Forke.</span>
        </h1>
        <p className="gsap-contact-desc text-muted text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto opacity-0">
          Have questions about your account, payouts, or want to contribute? Reach out directly via our official channels below.
        </p>
      </header>

      {/* Main Grid Layout */}
      <main className="relative z-10 px-6 max-w-6xl mx-auto pb-32">
        <div className="gsap-contact-grid space-y-12">
          
          {/* 4-Card Bento Grid Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 gsap-contact-block opacity-0">
            {/* Card 1: Email */}
            <a 
              href="mailto:support@forke.space"
              className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/15 transition-all duration-300 flex flex-col justify-between min-h-[180px]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/[0.04] text-accent transition-transform group-hover:scale-105">
                <Mail className="h-4.5 w-4.5" strokeWidth={1.5} />
              </div>
              <div className="space-y-1.5 mt-8">
                <h3 className="text-[15px] font-medium text-white flex items-center gap-1.5">
                  Email Support <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[11px] leading-relaxed text-white/45">General questions, payout disputes, and account recovery.</p>
                <p className="text-[12px] font-mono text-accent pt-1">support@forke.space</p>
              </div>
            </a>

            {/* Card 2: GitHub */}
            <a 
              href="https://github.com/forke-org"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/15 transition-all duration-300 flex flex-col justify-between min-h-[180px]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-white/70 transition-transform group-hover:scale-105">
                <GithubIcon className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1.5 mt-8">
                <h3 className="text-[15px] font-medium text-white flex items-center gap-1.5">
                  GitHub Organization <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[11px] leading-relaxed text-white/45">Inspect our open source projects and track merged PR actions.</p>
                <p className="text-[12px] font-mono text-white/45 pt-1">github.com/forke-org</p>
              </div>
            </a>

            {/* Card 3: LinkedIn */}
            <a 
              href="https://linkedin.com/company/forke"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/15 transition-all duration-300 flex flex-col justify-between min-h-[180px]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0077B5]/20 bg-[#0077B5]/[0.04] text-[#0077B5] transition-transform group-hover:scale-105">
                <LinkedinIcon className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1.5 mt-8">
                <h3 className="text-[15px] font-medium text-white flex items-center gap-1.5">
                  LinkedIn <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[11px] leading-relaxed text-white/45">Follow corporate announcements, product updates, and careers.</p>
                <p className="text-[12px] font-mono text-white/45 pt-1">linkedin.com/company/forke</p>
              </div>
            </a>

            {/* Card 4: Clock/SLA */}
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] flex flex-col justify-between min-h-[180px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-white/60">
                <Clock className="h-4.5 w-4.5" strokeWidth={1.5} />
              </div>
              <div className="space-y-1.5 mt-8">
                <h3 className="text-[15px] font-medium text-white">Resolution SLA</h3>
                <p className="text-[11px] leading-relaxed text-white/45">Our operations run Mon-Fri, 10 AM to 6 PM IST. We investigate all queries promptly.</p>
                <p className="text-[12px] font-mono text-white/35 pt-1">24–48 hours response time</p>
              </div>
            </div>
          </div>

          {/* 2-Column Info Details Row */}
          <div className="grid gap-8 lg:grid-cols-2 items-start gsap-contact-block opacity-0">
            {/* Left side: Expediting Tips */}
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] space-y-4">
              <div className="flex items-center gap-2.5 font-mono text-[11px] font-black uppercase tracking-wider text-accent">
                <AlertCircle className="h-4.5 w-4.5" />
                <span>Expedite Your Request</span>
              </div>
              <p className="text-[13px] font-light leading-relaxed text-white/50">
                To help us resolve your support enquiry as quickly as possible, please remember to include:
              </p>
              <div className="space-y-3 pt-1">
                {[
                  ['bounty disputes', 'Provide the task ID, candidate username, and PR link.'],
                  ['payout failures', 'Provide the settlement date, transaction ID, and UPI reference.'],
                  ['account issues', 'Write from the registered address linked to your GitHub/Google account.'],
                ].map(([topic, description]) => (
                  <div key={topic} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 text-[12.5px]">
                    <span className="font-mono text-[11px] text-white/40 min-w-[120px]">{topic} →</span>
                    <span className="font-light text-white/70">{description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: FAQs Accordion */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium tracking-tight text-white font-mono text-xs uppercase text-white/40">
                Frequently Asked Questions
              </h2>
              <div className="border-t border-white/[0.06]">
                {SUPPORT_FAQS.map((faq, i) => {
                  const isOpen = openFaq === i
                  return (
                    <div key={faq.q} className="border-b border-white/[0.06]">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-5 py-5 text-left group"
                      >
                        <span className={`text-[15px] font-medium transition-colors ${isOpen ? 'text-accent' : 'text-white/80 group-hover:text-white'}`}>
                          {faq.q}
                        </span>
                        <Plus
                          className={`h-4 w-4 shrink-0 text-white/45 transition-transform duration-300 ${isOpen ? 'rotate-45 text-accent' : ''}`}
                        />
                      </button>
                      <div
                        className="grid transition-[grid-template-rows] duration-300 ease-out"
                        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                      >
                        <div className="overflow-hidden">
                          <p className="pb-5 text-[13.5px] font-light leading-relaxed text-white/50">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
