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
    question: "How does Forke work?",
    answer: "Forke is a micro-task marketplace where developers can claim bounties for real-world coding tasks. Once you claim a task, you ship the code via a PR. After the maintainer approves and merges your work, you get paid instantly."
  },
  {
    question: "What skills do I need to start?",
    answer: "We have tasks for every level. Newcomers (Level 1) can start with basic HTML/CSS and bug fixes, while Experts (Level 4-5) tackle system architecture and performance optimization at scale."
  },
  {
    question: "How and when do I get paid?",
    answer: "Payments are processed immediately after your task is merged. We support various payment methods including UPI and direct bank transfers, ensuring you get your rewards without delay."
  },
  {
    question: "Is Forke free for developers?",
    answer: "Yes, Forke is 100% free for developers. There are no registration fees or hidden charges. You keep the full bounty amount listed on the task."
  },
  {
    question: "Can I post my own tasks?",
    answer: "Absolutely! If you have a project that needs help, you can post a bounty. Set your budget, describe the task, and watch as top-tier developers help you ship faster."
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
          <h2 className="gsap-faq-title font-serif text-5xl md:text-7xl text-white opacity-0">
            Common Questions
          </h2>
          <p className="gsap-faq-desc text-muted text-lg font-light opacity-0">
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
                  <span className={cn(
                    "text-xl md:text-2xl font-semibold transition-colors",
                    isActive ? "text-white" : "text-white/70 group-hover:text-white"
                  )}>
                    {faq.question}
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
                  <div className="gsap-faq-content-inner px-6 pb-8 md:px-8 md:pb-10">
                    <p className="text-lg text-white/50 font-light leading-relaxed max-w-3xl">
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
