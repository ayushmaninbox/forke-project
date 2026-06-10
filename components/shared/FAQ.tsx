'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const FAQS = [
  {
    question: "How do I get paid for completing bounties?",
    answer: "Startups deposit the full bounty amount into escrow before posting a task. Once you claim a task, build the solution in your branch, and submit a pull request, your code undergoes review. As soon as the client approves and merges your PR, the funds are immediately released directly to your registered UPI address."
  },
  {
    question: "What happens if I claim a task but cannot finish it?",
    answer: "To keep project repositories active and unblocked, tasks have completion deadlines (and a 20-minute reservation window to start work). If you run into issues, you can forfeit the task from your dashboard, which releases it back to the standby queue for other builders. While forfeiting is allowed, maintaining a high completion rate protects your Trust Score and unlocks higher bounty limits."
  },
  {
    question: "Are there any prerequisites or resume screenings to claim tasks?",
    answer: "No resume screenings, portfolio reviews, or interview rounds are required! Anyone can start claiming basic tasks. However, some advanced and higher-paying tasks are gated by your Platform Level and Skill Tier. You unlock access to these higher-tier tasks organically as you complete bounties, earn XP, and level up."
  },
  {
    question: "How does the level progression work, and what are the benefits?",
    answer: "Every completed task earns you Experience Points (XP). As your XP builds, you level up through 25 developmental milestones across 5 prestige tiers. Higher levels grant you access to larger bounty pools, priority reservation queues, private invite-only enterprise tasks, and eligibility to become a platform reviewer."
  },
  {
    question: "How is code review handled on Forke?",
    answer: "Every pull request passes through an automated validation check that compiles the build, runs unit tests, lints, and checks for vulnerabilities. This is followed by an AI analysis to check logic. Finally, the startup's repository maintainers review and merge the PR. Once merged, your payout is automatically processed."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(() => {
    // 1. Scroll triggered stagger reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })

    tl.fromTo('.gsap-faq-title',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo('.gsap-faq-desc',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo('.gsap-faq-card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      '-=0.4'
    )
  }, { scope: containerRef })

  // 2. Dynamic height accordion animation
  useEffect(() => {
    contentRefs.current.forEach((el, index) => {
      if (!el) return
      
      const icon = iconRefs.current[index]
      const inner = el.querySelector('.gsap-faq-content-inner')
      
      if (openIndex === index) {
        // Expand content
        gsap.to(el, {
          height: 'auto',
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        })
        
        // Slide up/fade in inner content
        if (inner) {
          gsap.fromTo(inner, 
            { y: -8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' }
          )
        }
        
        // Rotate and style active icon (turns Plus into 'X' close icon)
        if (icon) {
          gsap.to(icon, {
            rotation: 135,
            backgroundColor: '#FF7A00',
            borderColor: '#FF7A00',
            color: '#050505',
            duration: 0.4,
            ease: 'power2.out'
          })
        }
      } else {
        // Collapse content
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        })
        
        // Fade out inner content immediately to avoid clipping
        if (inner) {
          gsap.to(inner, {
            opacity: 0,
            y: -8,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          })
        }
        
        // Reset icon
        if (icon) {
          gsap.to(icon, {
            rotation: 0,
            backgroundColor: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.4)',
            duration: 0.4,
            ease: 'power2.out'
          })
        }
      }
    })
  }, [openIndex])

  return (
    <section ref={containerRef} className="py-32 bg-bg relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="gsap-faq-title ui-eyebrow block opacity-0">{'//'} faq</span>
          <h2 className="gsap-faq-title text-4xl md:text-6xl font-medium text-white tracking-[-0.03em] opacity-0">
            Common <span className="font-serif italic font-normal text-accent">questions.</span>
          </h2>
          <p className="gsap-faq-desc text-muted text-base md:text-lg font-light opacity-0">
            Everything you need to know about shipping and earning on Forke.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isActive = openIndex === index
            
            return (
              <div 
                key={index}
                className={cn(
                  "gsap-faq-card group rounded-2xl border transition-all duration-300 opacity-0",
                  isActive 
                    ? "bg-accent/[0.03] border-accent/30 shadow-[0_0_30px_rgba(255,122,0,0.05)]" 
                    : "bg-white/[0.02] border-white/[0.05] hover:border-white/10"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isActive ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left cursor-pointer"
                >
                  <span className="flex items-baseline gap-4 min-w-0">
                    <span className={cn(
                      "font-mono text-xs shrink-0 transition-colors",
                      isActive ? "text-accent" : "text-white/30 group-hover:text-accent/70"
                    )}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={cn(
                      "text-lg md:text-xl font-medium tracking-[-0.01em] transition-colors",
                      isActive ? "text-white" : "text-white/70 group-hover:text-white"
                    )}>
                      {faq.question}
                    </span>
                  </span>
                  
                  <div 
                    ref={(el) => { iconRefs.current[index] = el }}
                    className="flex-shrink-0 ml-4 w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300"
                    style={{
                      transformOrigin: 'center',
                    }}
                  >
                    <Plus className="w-5 h-5" />
                  </div>
                </button>
                
                {/* Accordion content container */}
                <div 
                  ref={(el) => { contentRefs.current[index] = el }}
                  style={{
                    height: isActive ? 'auto' : 0,
                    opacity: isActive ? 1 : 0,
                    overflow: 'hidden',
                    willChange: 'height, opacity'
                  }}
                >
                  <div className="gsap-faq-content-inner px-6 pb-8 md:px-8 md:pb-10 pl-[58px] md:pl-[66px]">
                    <p className="text-base md:text-lg text-white/50 font-light leading-relaxed max-w-3xl">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
