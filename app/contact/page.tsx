'use client'

import React, { useRef } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import DotField from '@/components/shared/DotField'
import { Mail, Clock, ArrowRight } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

export default function ContactPage() {
  const pageContainerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
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
    .fromTo('.gsap-contact-card',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
      '-=0.5'
    )
    .fromTo('.gsap-contact-scope',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.4'
    )
  }, { scope: pageContainerRef })

  return (
    <div ref={pageContainerRef} className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans relative selection:bg-accent selection:text-white">
      <Navbar />

      {/* Ambient background Dot Grid */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none opacity-50"
        style={{
          maskImage: 'radial-gradient(circle at 50% 30%, transparent 10%, black 60%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 30%, transparent 10%, black 60%)',
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
      <header className="relative z-10 pt-36 md:pt-44 pb-16 px-6 max-w-4xl mx-auto text-center space-y-4">
        <div className="gsap-contact-badge flex items-center justify-center gap-2 opacity-0">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-accent">Support Portal</span>
        </div>
        <h1 className="gsap-contact-title font-serif text-5xl md:text-7xl text-white tracking-tight leading-none opacity-0">
          Contact <span className="text-accent italic font-normal text-glow">Forke</span>
        </h1>
        <p className="gsap-contact-desc text-muted text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto opacity-0">
          Have a question about a bounty? Need help with account recovery, payouts, or want to dispute a submission? We are here to help.
        </p>
      </header>

      {/* Content */}
      <main className="relative z-10 px-6 max-w-4xl mx-auto pb-24 space-y-12">
        
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Email Support */}
          <div className="gsap-contact-card relative p-8 rounded-3xl border border-white/[0.04] bg-[#0A0A0A] hover:border-[#FF7A00]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between min-h-[280px] group opacity-0 overflow-hidden text-left">
            {/* Spotlight Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.02)_0%,_transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />
            
            <div>
              {/* Premium Icon Badge */}
              <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-[#FF7A00] group-hover:bg-[#FF7A00] group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-500 shrink-0 mb-6 relative z-10">
                <Mail className="w-5 h-5" />
              </div>
              
              <div className="space-y-2 relative z-10 text-left">
                <h3 className="text-white font-bold text-xl tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">
                  Email Support
                </h3>
                <p className="text-xs text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300">
                  Submit account inquiries, bounty disputes, developer payout settlements, or general feedback.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-6 border-t border-white/[0.05]">
              <a 
                href="mailto:support@forke.space" 
                className="inline-flex items-center gap-2 text-xs font-mono text-accent hover:underline"
              >
                support@forke.space <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 2: SLA & Business Hours */}
          <div className="gsap-contact-card relative p-8 rounded-3xl border border-white/[0.04] bg-[#0A0A0A] hover:border-[#FF7A00]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between min-h-[280px] group opacity-0 overflow-hidden text-left">
            {/* Spotlight Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.02)_0%,_transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />
            
            <div>
              {/* Premium Icon Badge */}
              <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-[#FF7A00] group-hover:bg-[#FF7A00] group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-500 shrink-0 mb-6 relative z-10">
                <Clock className="w-5 h-5" />
              </div>
              
              <div className="space-y-2 relative z-10 text-left">
                <h3 className="text-white font-bold text-xl tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">
                  Support Hours
                </h3>
                <p className="text-xs text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300">
                  Our operations run Monday to Friday, 10:00 AM to 6:00 PM IST. We investigate all queries promptly.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-6 border-t border-white/[0.05] text-left">
              <span className="text-xs font-mono text-white/30">
                Response SLA: 24-48 Hours
              </span>
            </div>
          </div>

        </div>

        {/* Support Scope Section */}
        <section className="gsap-contact-scope relative p-8 rounded-3xl border border-white/[0.04] bg-[#0A0A0A] hover:border-[#FF7A00]/15 transition-colors duration-300 opacity-0 overflow-hidden text-left space-y-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.01)_0%,_transparent_65%)] opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />
          <h2 className="text-xl font-serif text-white">How to expedite your support request:</h2>
          <p className="text-sm text-white/45 leading-relaxed font-light">
            When emailing our team, please include the following details so we can resolve your query faster:
          </p>
          <ul className="space-y-3 text-xs text-white/40 font-mono pl-4">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0" />
              <span>For Bounty Disputes: Include the specific Task ID, claimant username, and GitHub pull request URL.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0" />
              <span>For Payout Failures: Include the transaction date, UPI Reference Number, and amount.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0" />
              <span>For Account Access: Email us from the specific email address linked to your Forke account or OAuth provider (GitHub / Google).</span>
            </li>
          </ul>
        </section>

      </main>

      <Footer />
    </div>
  )
}
