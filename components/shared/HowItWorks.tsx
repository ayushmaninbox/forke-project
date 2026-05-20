'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const STEPS = [
  {
    number: '01',
    title: 'Post a Task',
    description: 'Clients post scoped coding tasks with clear briefs and escrow-held budgets.',
    image: '/forke-assets/landing-assets/forky_holding_idea.png',
  },
  {
    number: '02',
    title: 'Claim & Submit',
    description: 'Developers claim tasks based on their level and submit work via GitHub PR.',
    image: '/forke-assets/landing-assets/locked_in_forky.png',
  },
  {
    number: '03',
    title: 'Get Paid',
    description: 'Once approved, payment releases automatically via UPI in minutes.',
    image: '/forke-assets/landing-assets/rich_forky.png',
  },
]

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      }
    })

    // 1. Reveal title and draw underline
    tl.fromTo('.gsap-how-title',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo('.gsap-how-underline',
      { strokeDashoffset: 100 },
      { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.4'
    )
    // 2. Stagger in step cards
    .fromTo('.gsap-how-step',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.25, ease: 'power3.out' },
      '-=0.4'
    )
    // 3. Stagger in mascots inside steps with elastic bounce
    .fromTo('.gsap-how-mascot',
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, stagger: 0.25, ease: 'elastic.out(1, 0.65)' },
      '-=0.8'
    )
    // 4. Draw connecting arrows
    .fromTo('.gsap-how-arrow-path',
      { strokeDashoffset: 160 },
      { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut' },
      '-=1.2'
    )
    .fromTo('.gsap-how-arrow-head',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' },
      '-=0.4'
    )
  }, { scope: containerRef })

  return (
    <section ref={containerRef} id="how-it-works" className="py-48 px-4 bg-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 relative">
          <div className="inline-block relative">
            <h2 className="gsap-how-title font-serif text-5xl md:text-7xl text-white opacity-0">
              How it works
            </h2>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 text-accent opacity-80">
              <svg width="100%" height="100%" viewBox="0 0 100 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M2 10C15 4 45 2 98 6" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  className="gsap-how-underline"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 relative">
          {STEPS.map((step, index) => (
            <div key={index} className="gsap-how-step group relative flex flex-col items-center text-center opacity-0">
              {/* Background Number */}
              <span className="absolute -top-16 left-0 text-[140px] font-black text-white/[0.07] leading-none pointer-events-none group-hover:text-accent/[0.15] transition-all duration-500">
                {step.number}
              </span>

              {/* Mascot Image */}
              <div className="gsap-how-mascot relative w-64 h-64 mb-6 z-10 opacity-0 scale-75">
                <Image 
                  src={step.image} 
                  alt={step.title} 
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Text Content */}
              <div className="space-y-4 max-w-xs relative z-10">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted leading-relaxed font-light text-base px-2">
                  {step.description}
                </p>
              </div>
              
              {/* Curved Dashed Arrow (desktop only) */}
              {index < 2 && (
                <div className="hidden md:block absolute top-28 -right-24 w-48 h-12 z-0">
                  <svg width="100%" height="100%" viewBox="0 0 160 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent/30 overflow-visible">
                    <path 
                      d="M10 24C40 4 120 4 150 24" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeDasharray="8" 
                      strokeDashoffset="160"
                      className="gsap-how-arrow-path" 
                    />
                    <path 
                      d="M142 12L152 24L136 28" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="gsap-how-arrow-head opacity-0"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
