'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const router = useRouter()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hasSiteAccess, setHasSiteAccess] = useState(false)
  const [waitlistActive, setWaitlistActive] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    // Read helper cookies
    const getCookie = (name: string): string | null => {
      if (typeof document === 'undefined') return null
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null
      return null
    }

    const siteAccess = getCookie('site_access_public') === 'true'
    const waitlist = getCookie('waitlist_active') === 'true'
    const animHandle = requestAnimationFrame(() => {
      setHasSiteAccess(siteAccess)
      setWaitlistActive(waitlist)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animHandle)
    }
  }, [])

  const showWaitlisterView = waitlistActive && !hasSiteAccess

  const navLinks = showWaitlisterView ? [
    { name: "What's Forke?", href: '/whats-forke' },
    { name: 'Levels', href: '/levels' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact Us', href: '/contact' },
  ] : [
    { name: "What's Forke?", href: '/whats-forke' },
    { name: 'Bounties', href: '/bounties' },
    { name: 'Levels', href: '/levels' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact Us', href: '/contact' },
  ]

  return (
    <nav className="fixed left-0 right-0 top-6 z-50 px-4 transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto min-[1920px]:max-w-[1920px]">
        <div className={cn(
          "flex justify-between items-center h-16 sm:h-[4.25rem] px-4 sm:px-7 rounded-full border transition-all duration-300",
          isScrolled
             ? "border-white/[0.12] bg-black/[0.5] backdrop-blur-3xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
             : "border-white/[0.08] bg-black/[0.25] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        )}>

          <Link href="/" className="flex items-center gap-2 group shrink-0 relative pt-2">
            <div className="absolute -top-[20px] sm:-top-[26px] -left-3 sm:-left-4 w-[120px] sm:w-[150px] h-[72px] sm:h-[92px] z-20 pointer-events-none">
              <Image
                src="/forke-assets/nav_peeking_forky.png"
                alt="Forke Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-[100px] sm:w-[130px] h-[40px] " /> {/* Spacer for the absolute mascot */}
            <span className="text-2xl sm:text-[1.75rem] font-semibold tracking-[-0.04em] text-white -ml-4 sm:-ml-6 relative z-10">
              forke<span className="text-accent">*</span>
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group/link font-mono text-[12.5px] lowercase text-white/55 hover:text-white transition-colors"
              >
                <span className="text-accent/0 group-hover/link:text-accent/80 transition-colors">/</span>{link.name.replace(/[?'’]/g, '').replace(/\s+/g, '-').toLowerCase()}
              </Link>
            ))}
          </div>
          
          {/* Right: CTA Section */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {showWaitlisterView ? (
              <Button 
                variant="primary" 
                className="hidden lg:inline-flex rounded-full px-5 py-2 h-auto text-[13px] font-semibold tracking-tight bg-accent hover:bg-accent-hover text-[#0a0a0a] shadow-none transition-colors" 
                onClick={() => router.push('/')}
              >
                Coming Soon
              </Button>
            ) : isLoggedIn ? (
              <Button 
                variant="primary" 
                className="hidden lg:inline-flex rounded-full px-5 py-2 h-auto text-[13px] font-semibold tracking-tight bg-accent hover:bg-accent-hover text-[#0a0a0a] shadow-none transition-colors" 
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <Button 
                variant="primary" 
                className="hidden lg:inline-flex rounded-full px-5 py-2 h-auto text-[13px] font-semibold tracking-tight bg-accent hover:bg-accent-hover text-[#0a0a0a] shadow-none transition-colors" 
                onClick={() => router.push('/register')}
              >
                Get Started
              </Button>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>      {/* Mobile Menu — full-screen overlay with centered navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-2xl" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full px-6 py-8 animate-in fade-in duration-300">
            {/* Header — logo + close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src="/forke-assets/nav_peeking_forky.png"
                  alt="Forke"
                  width={60}
                  height={36}
                  className="object-contain"
                />
                <span className="text-xl font-semibold tracking-[-0.04em] text-white">
                  forke<span className="text-accent">*</span>
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation links — centered vertically */}
            <div className="flex-1 flex flex-col items-start justify-center gap-2 -mt-8">
              {navLinks.map((link, i) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-4 py-3 transition-colors active:bg-white/[0.04] w-full rounded-xl px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="font-mono text-[11px] text-accent/50 tabular-nums w-5">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[22px] font-light tracking-[-0.02em] text-white/80 transition-colors group-hover:text-white group-active:text-accent">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="pt-4 border-t border-white/[0.06] space-y-3">
              {showWaitlisterView ? (
                <Button variant="primary" className="w-full h-12 rounded-xl bg-accent hover:bg-accent-hover text-[#0a0a0a] text-[15px] font-semibold tracking-tight shadow-none" onClick={() => { setIsMobileMenuOpen(false); router.push('/'); }}>
                  Coming Soon
                </Button>
              ) : isLoggedIn ? (
                <Button variant="primary" className="w-full h-12 rounded-xl bg-accent hover:bg-accent-hover text-[#0a0a0a] text-[15px] font-semibold tracking-tight shadow-none" onClick={() => { setIsMobileMenuOpen(false); router.push('/dashboard'); }}>
                  Dashboard
                </Button>
              ) : (
                <Button variant="primary" className="w-full h-12 rounded-xl bg-accent hover:bg-accent-hover text-[#0a0a0a] text-[15px] font-semibold tracking-tight shadow-none" onClick={() => { setIsMobileMenuOpen(false); router.push('/register'); }}>
                  Get Started
                </Button>
              )}
              <p className="text-center font-mono text-[10px] tracking-wide text-white/20">
                {'//'} prove skill by shipping
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
