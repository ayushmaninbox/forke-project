'use client'

import React, { useRef, useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import DotField from '@/components/shared/DotField'
import { Mail, Clock, Plus, AlertCircle, ArrowUpRight, Share2 } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
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

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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

            {/* Card 2: GitHub (standalone) */}
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
                  GitHub <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[11px] leading-relaxed text-white/45">Inspect our open source projects and merged contributions.</p>
                <p className="text-[12px] font-mono text-white/45 pt-1">github.com/forke-org</p>
              </div>
            </a>

            {/* Card 3: Socials — same skeleton as its siblings; icons turn orange on hover */}
            <div className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] transition-all duration-300 hover:bg-white/[0.03] hover:border-white/15 flex flex-col justify-between min-h-[180px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-white/60">
                <Share2 className="h-4.5 w-4.5" strokeWidth={1.5} />
              </div>
              <div className="space-y-1.5 mt-8">
                <h3 className="text-[15px] font-medium text-white">Socials</h3>
                <p className="text-[11px] leading-relaxed text-white/45">Follow along for updates and Forky moments.</p>
                {/* icon row sits where siblings put their handle line */}
                <div className="flex items-center gap-3.5 pt-1.5">
                  {[
                    { Icon: XIcon, href: 'https://x.com/forkespace', label: 'X' },
                    { Icon: InstagramIcon, href: 'https://www.instagram.com/forke.space/', label: 'Instagram' },
                    { Icon: LinkedinIcon, href: 'https://www.linkedin.com/company/forke/', label: 'LinkedIn' },
                    { Icon: ThreadsIcon, href: 'https://www.threads.com/@forke.space', label: 'Threads' },
                    { Icon: FacebookIcon, href: 'https://www.facebook.com/people/Forke/61591130679350/', label: 'Facebook' },
                  ].map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="text-white/40 transition-colors hover:text-accent"
                    >
                      <Icon className="h-[17px] w-[17px]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

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
