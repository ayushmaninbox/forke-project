import React from 'react'
import Image from 'next/image'

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
  return (
    <section id="how-it-works" className="py-40 px-4 bg-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 relative">
          <div className="inline-block relative">
            <h2 className="font-serif text-5xl md:text-7xl text-white">
              How it works
            </h2>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 text-accent opacity-80">
              <svg width="100%" height="100%" viewBox="0 0 100 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C15 4 45 2 98 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="animate-draw" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 relative">
          {STEPS.map((step, index) => (
            <div key={index} className="group relative flex flex-col items-center text-center">
              {/* Background Number */}
              <span className="absolute -top-12 left-0 text-[120px] font-black text-white/[0.03] leading-none pointer-events-none group-hover:text-white/[0.05] transition-colors">
                {step.number}
              </span>

              {/* Mascot Image */}
              <div className="relative w-48 h-48 mb-6 z-10">
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
                <div className="hidden md:block absolute top-20 -right-16 w-32 h-12 z-0">
                  <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/10 opacity-60">
                    <path d="M4 24C30 4 98 4 124 24" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                    <path d="M120 20L124 24L120 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
