'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, Flame, Star, Mail, Check, AlertCircle } from 'lucide-react'
import DotField from '@/components/shared/DotField'
import { Loader } from '@/components/ui/Loader'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useSearchParams } from 'next/navigation'

function WaitlistPageContent() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')

  const containerRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    if (!emailParam) return

    async function checkWaitlistEmail() {
      setVerifying(true)
      try {
        const checkRes = await fetch(`/api/waitlist/check?email=${encodeURIComponent(emailParam || '')}`)
        const checkData = await checkRes.json()
        if (checkData.success && checkData.joined) {
          // Set waitlist_joined cookie on client side
          document.cookie = "waitlist_joined=true; path=/; max-age=31536000; SameSite=Lax"
          window.location.href = '/'
          return
        } else {
          setEmail(emailParam || '')
        }
      } catch (err) {
        console.error('Waitlist email check failed:', err)
      }
      setVerifying(false)
    }

    checkWaitlistEmail()
  }, [emailParam])

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/waitlist/count')
        const data = await res.json()
        if (data.success) {
          setSubscriberCount(data.count)
        }
      } catch (err) {
        console.error('Failed to fetch subscriber count:', err)
      }
    }
    fetchCount()
  }, [])

  // Bulletproof lock to completely remove page/body scrollability
  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyOverflow = document.body.style.overflow
    const originalBodyHeight = document.body.style.height

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100%'

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.overflow = originalBodyOverflow
      document.body.style.height = originalBodyHeight
    }
  }, [])

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo('.gsap-wl-tagline',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: 0.2 }
    )
      .fromTo('.gsap-wl-title',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.3'
      )
      .fromTo('.gsap-wl-subtitle',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.5'
      )
      .fromTo('.gsap-wl-cta',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' },
        '-=0.4'
      )
      .fromTo('.gsap-wl-check',
        { x: -15, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
        '-=0.3'
      )
      .fromTo('.gsap-hero-mascot',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.75)' },
        '-=1.2'
      )
      .fromTo('.gsap-hero-badge',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, stagger: 0.12, ease: 'back.out(1.7)' },
        '-=1'
      )
      .fromTo('.gsap-wl-footer',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.5'
      )

    // Floating badges animation
    gsap.utils.toArray<HTMLElement>('.gsap-hero-badge').forEach((badge, index) => {
      const yOffset = 12 + (index % 3) * 4
      const duration = 4 + (index % 2) * 1.5
      gsap.to(badge, {
        y: `+=${yOffset}`,
        rotation: index % 2 === 0 ? '+=2' : '-=2',
        duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.3
      })
    })

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const moveX = e.clientX - window.innerWidth / 2
      const moveY = e.clientY - window.innerHeight / 2

      gsap.to('.gsap-hero-mascot', {
        x: moveX * 0.015,
        y: moveY * 0.015,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto'
      })

      gsap.utils.toArray<HTMLElement>('.gsap-hero-badge').forEach((badge) => {
        const speed = parseFloat(badge.getAttribute('data-speed') || '0.04')
        gsap.to(badge, {
          x: moveX * speed,
          y: moveY * speed,
          duration: 1,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, { scope: containerRef })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    // 1. Custom validation for empty email (makes error gorgeous & native-free)
    if (!email || !email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address.')
      return
    }

    // 2. Custom validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    try {
      const res = await fetch('/api/waitlist/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message)
        setSubscriberCount((prev) => (prev !== null ? prev + 1 : 1))
        // Set waitlist_joined cookie on client side
        document.cookie = "waitlist_joined=true; path=/; max-age=31536000; SameSite=Lax"
        // Animate success
        gsap.fromTo('.gsap-wl-success',
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
        )
        // Redirect to landing page after 1.5 seconds
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      } else {
        setStatus('error')
        setMessage(data.message)
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div ref={containerRef} className="h-[100dvh] max-h-[100dvh] min-h-[100dvh] bg-[#050505] text-white overflow-hidden relative selection:bg-accent selection:text-white flex flex-col justify-between pt-2 sm:pt-4 md:pt-8 lg:pt-12">
      {/* Animated Dot Field Background */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-40"
        style={{
          maskImage: 'radial-gradient(circle at 80% 50%, transparent 10%, black 40%)',
          WebkitMaskImage: 'radial-gradient(circle at 80% 50%, transparent 10%, black 40%)',
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

      {/* Background Glow Blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] right-[-10%] w-[800px] h-[800px] bg-accent/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* ===== HERO / CTA MAIN VIEW ===== */}
      <main className="flex-1 flex items-center justify-center overflow-hidden py-2 px-6 md:px-8 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full relative">

          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6 text-left relative z-20">
            {/* Tagline */}
            <div className="gsap-wl-tagline opacity-0 whitespace-nowrap">
              <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.35em] text-accent/70 whitespace-nowrap">
                Real code · Real impact · Real rewards
              </p>
            </div>

            {/* Main Heading */}
            <div className="space-y-2 sm:space-y-4">
              <h1 className="gsap-wl-title font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight opacity-0">
                Join the waitlist. <br />
                <span className="text-accent text-glow">Build the future.</span>
              </h1>

              <p className="gsap-wl-subtitle text-sm md:text-base text-white/50 max-w-xl leading-relaxed font-light opacity-0">
                Forke is a micro-task marketplace where developers claim bounties, ship real code, and earn rewards. We&apos;re building something big — and you can be first in.
              </p>
            </div>

            {/* Email CTA Glass Card */}
            <div className="gsap-wl-cta opacity-0 relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] bg-black/60 border border-white/10 backdrop-blur-2xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] overflow-hidden group max-w-md w-full">
              {/* Ambient gradient hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10">
                {verifying ? (
                  <div className="flex flex-col items-center justify-center text-center py-6">
                    <Loader text="Checking waitlist status..." />
                    <p className="text-[10px] text-white/30 mt-3">Verifying your early access email.</p>
                  </div>
                ) : status === 'success' ? (
                  <div className="gsap-wl-success flex flex-col items-center justify-center text-center space-y-4 py-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <Check className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-serif text-white">{message || "You're on the list!"}</h3>
                      <p className="text-xs text-white/40">We&apos;ll notify you the moment Forke goes live.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-base font-serif text-white tracking-wide">Be the first to know</h2>
                      <p className="text-xs text-white/40">Drop your email to join early access and product updates.</p>
                      {subscriberCount !== null && (
                        <div className="flex items-center gap-2 mt-1 animate-in fade-in slide-in-from-top-1 duration-500">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                          </span>
                          <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider font-mono">
                            {subscriberCount > 0 ? `Join ${subscriberCount} others in the waitlist` : 'Be the first in the waitlist'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (status === 'error') setStatus('idle')
                          }}
                          placeholder="you@email.com"
                          className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="h-12 px-6 text-xs font-black uppercase tracking-[0.15em] rounded-xl bg-gradient-to-b from-accent to-[#d97706] border-b-2 border-black/30 shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(180,83,9)] active:translate-y-[3px] active:shadow-none transition-all duration-75 text-[#050505] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 font-bold"
                      >
                        {status === 'loading' ? (
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                          <>
                            Join <Zap className="w-3.5 h-3.5 fill-current" />
                          </>
                        )}
                      </button>
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-pulse">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{message}</span>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Feature Checks */}
            <div className="flex flex-row flex-nowrap items-center gap-1.5 sm:gap-2.5 whitespace-nowrap overflow-hidden">
              {['Real-world tasks', 'Verified contributions', 'Fast payouts'].map((text) => (
                <div key={text} className="gsap-wl-check flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-white/[0.02] border border-white/[0.04] opacity-0 whitespace-nowrap flex-shrink-0">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent flex-shrink-0" />
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white/50 tracking-wide whitespace-nowrap">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content — Exactly identical visual mascot layout from landing hero */}
          <div className="hidden lg:block lg:col-span-5 relative h-full w-full pointer-events-none">
            {/* Hero Visual Area - Orbital Layout */}
            <div className="absolute right-[-300px] top-1/2 -translate-y-1/2 w-[1200px] h-[1200px] pointer-events-none">

              {/* Connecting Lines SVG Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible opacity-20">
                <defs>
                  <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="var(--color-accent)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path d="M 300 450 Q 450 500 600 600" stroke="url(#line-grad)" strokeWidth="1" fill="transparent" className="animate-pulse" />
                <path d="M 900 350 Q 800 450 650 600" stroke="url(#line-grad)" strokeWidth="1" fill="transparent" className="animate-pulse" />
              </svg>

              {/* The Mascot */}
              <div
                className="gsap-hero-mascot absolute inset-0 flex items-center justify-center z-10 opacity-0"
                style={{
                  maskImage: 'radial-gradient(circle, black 70%, transparent 95%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 70%, transparent 95%)',
                }}
              >
                <Image
                  src="/forke-assets/landing-assets/hero-image-forky.png"
                  alt="Forky Mascot"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Floating Rupees */}
              <div
                className="gsap-hero-badge absolute top-[45%] left-[25%] w-14 h-14 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-xl font-bold z-0 rotate-[-5deg] opacity-0"
                data-speed="0.07"
              >
                ₹
              </div>
              <div
                className="gsap-hero-badge absolute top-[58%] right-[25%] w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-lg font-bold z-0 rotate-[9deg] opacity-0"
                data-speed="0.06"
              >
                ₹
              </div>

              {/* Floating Task Cards */}
              <div
                className="gsap-hero-badge absolute top-[28%] left-[26%] glass p-3 rounded-xl shadow-glow z-0 pointer-events-auto transition-transform opacity-0 border border-white/10"
                data-speed="0.04"
              >
                <div className="flex items-center justify-between gap-6 mb-1">
                  <span className="text-xs font-medium text-white">Fix navbar overflow</span>
                  <span className="text-accent font-bold text-xs">₹300</span>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold tracking-wider uppercase">Bug Fix</span>
              </div>

              <div
                className="gsap-hero-badge absolute top-[42%] right-[19.5%] glass p-3 rounded-xl shadow-glow z-20 pointer-events-none transition-transform opacity-0 border border-white/10"
                data-speed="0.05"
              >
                <div className="flex items-center justify-between gap-6 mb-1">
                  <span className="text-xs font-medium text-white">Add dark mode</span>
                  <span className="text-accent font-bold text-xs">₹600</span>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold tracking-wider uppercase">React</span>
              </div>

              {/* Streak Badge */}
              <div
                className="gsap-hero-badge absolute top-[24%] right-[42%] glass-orange px-4 py-2 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(255,122,0,0.2)] z-20 border border-white/20 pointer-events-none hover:scale-105 transition-transform opacity-0"
                data-speed="0.03"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-accent fill-accent" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white font-black text-lg leading-none">7</span>
                  <span className="text-[8px] text-accent uppercase font-bold tracking-widest leading-none">Day Streak</span>
                </div>
              </div>

              {/* XP Badge */}
              <div
                className="gsap-hero-badge absolute top-[27%] right-[30%] glass px-3 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-2xl z-10 pointer-events-none rotate-[7deg] opacity-0"
                data-speed="0.02"
              >
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-accent font-bold text-sm">+250 XP</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ===== DARKER DOCK FOOTER (LOCKS 100% TO BOTTOM EDGES) ===== */}
      <footer className="gsap-wl-footer opacity-0 flex-shrink-0 w-full border-t border-white/[0.03] bg-[#020202]/75 backdrop-blur-md py-3 px-6 md:px-8 lg:px-12 mt-auto relative z-20">
        {/* Peeking Forky for Phone/Mobile viewports only — Static and enlarged */}
        <div className="absolute -top-[80px] left-[8%] sm:left-[12%] w-[165px] h-[100px] pointer-events-none lg:hidden z-10 select-none">
          <Image
            src="/forke-assets/nav_peeking_forky.png"
            alt="Peeking Forky"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4 text-[10px] text-white/15 font-bold uppercase tracking-wider">
            <span>© 2026 FORKE</span>
          </div>

          <p className="font-serif text-xs text-white/20">
            See you on the other side! ♥
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <WaitlistPageContent />
    </Suspense>
  )
}
