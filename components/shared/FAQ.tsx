'use client'

import React, { useState } from 'react'
import { ChevronDown, Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

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

  return (
    <section className="py-32 bg-bg relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-5xl md:text-7xl text-white">
            Common Questions
          </h2>
          <p className="text-muted text-lg font-light">
            Everything you need to know about shipping and earning on Forke.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index}
              className={cn(
                "group rounded-2xl border transition-all duration-300",
                openIndex === index 
                  ? "bg-accent/[0.03] border-accent/30 shadow-[0_0_30px_rgba(255,122,0,0.05)]" 
                  : "bg-white/[0.02] border-white/[0.05] hover:border-white/10"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <span className={cn(
                  "text-xl md:text-2xl font-medium transition-colors",
                  openIndex === index ? "text-white" : "text-white/70 group-hover:text-white"
                )}>
                  {faq.question}
                </span>
                <div className={cn(
                  "flex-shrink-0 ml-4 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300",
                  openIndex === index 
                    ? "bg-accent border-accent text-bg rotate-0" 
                    : "border-white/10 text-white/40 rotate-180"
                )}>
                  {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>
              
              <div className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="px-6 pb-8 md:px-8 md:pb-10">
                  <p className="text-lg text-white/50 font-light leading-relaxed max-w-3xl">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
