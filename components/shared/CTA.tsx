'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CTA() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useGSAP(() => {
    // 1. Scroll-triggered entrance animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    })

    tl.fromTo('.gsap-cta-card',
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.gsap-cta-title',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
    .fromTo('.gsap-cta-text',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo(buttonRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '-=0.4'
    )
    .fromTo('.gsap-cta-mascot',
      { x: 150, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: 'power4.out' },
      '-=1'
    )

    // 2. Slow particle floating animation
    gsap.utils.toArray<HTMLElement>('.gsap-cta-particle').forEach((particle, index) => {
      const yOffset = 15 + (index % 3) * 5
      const xOffset = 10 + (index % 2) * 5
      const duration = 4 + (index % 2) * 2
      
      gsap.to(particle, {
        x: `+=${xOffset}`,
        y: `+=${yOffset}`,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.4
      })
    })

    // 3. Magnetic Button Effect
    const btn = buttonRef.current
    if (!btn) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      // Pull button towards cursor
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      // Snap button back to original position
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      })
    }

    btn.addEventListener('mousemove', handleMouseMove)
    btn.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove)
      btn.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="py-24 bg-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* CTA Card */}
        <div 
          className="gsap-cta-card relative rounded-[2.5rem] overflow-x-clip overflow-y-visible border border-white/[0.06] min-h-[320px] opacity-0"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #111 30%, #1a1208 60%, #1f1510 80%, #1a1008 100%)'
          }}
        >
          {/* Warm ambient glow behind the mascot */}
          <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(ellipse_at_70%_50%,_rgba(255,122,0,0.1)_0%,_transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 right-[20%] w-[400px] h-[200px] bg-[radial-gradient(ellipse_at_center,_rgba(255,122,0,0.06)_0%,_transparent_70%)] pointer-events-none" />
          
          {/* Floating particles */}
          <div className="gsap-cta-particle absolute top-[20%] right-[30%] w-1.5 h-1.5 rounded-full bg-accent/40 animate-pulse" />
          <div className="gsap-cta-particle absolute top-[35%] right-[48%] w-1 h-1 rounded-full bg-accent/30 animate-pulse [animation-delay:1s]" />
          <div className="gsap-cta-particle absolute top-[15%] right-[22%] w-1 h-1 rounded-full bg-accent/25 animate-pulse [animation-delay:2s]" />
          <div className="gsap-cta-particle absolute bottom-[30%] right-[40%] w-1.5 h-1.5 rounded-full bg-accent/20 animate-pulse [animation-delay:0.5s]" />
          <div className="gsap-cta-particle absolute top-[60%] right-[55%] w-1 h-1 rounded-full bg-accent/15 animate-pulse [animation-delay:1.5s]" />

          <div className="relative z-10 flex items-center min-h-[320px]">
            {/* Left side — Text + CTA */}
            <div className="flex-1 p-12 md:p-16 space-y-6">
              <h2 className="gsap-cta-title font-serif text-4xl md:text-6xl text-white tracking-tight leading-[1.1] opacity-0">
                Ready to ship?
              </h2>
              <p className="gsap-cta-text text-lg text-white/50 font-light max-w-md opacity-0">
                Join Forke and start earning while you code.
              </p>
              <Button 
                ref={buttonRef}
                size="lg" 
                variant="primary"
                className="text-lg px-10 py-5 gap-2 rounded-xl opacity-0"
                onClick={() => router.push('/register')}
              >
                Get Started Free <Zap className="w-5 h-5 fill-current" />
              </Button>
            </div>

            {/* Code snippet — positioned closer to the mascot */}
            <div className="hidden lg:block absolute right-[37%] top-1/3 -translate-y-1/2 opacity-[0.12]">
              <pre className="font-mono text-sm text-accent leading-relaxed">
{`const hustle = () => {
  ship();
  earn();
  repeat();
};`}
              </pre>
            </div>
          </div>

          {/* Right side — Chilling Forky Mascot (massive, overflows card) */}
          <div className="gsap-cta-mascot hidden md:block absolute -bottom-18 right-4 w-[750px] h-[520px] pointer-events-none opacity-0">
            <Image 
              src="/forke-assets/landing-assets/chilling_forky.png" 
              alt="Chilling Forky" 
              fill
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
