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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: "What's Forke?", href: '/whats-forke' },
    { name: 'Bounties', href: '/bounties' },
    { name: 'Leaderboards', href: '/leaderboard' },
    { name: 'Levels', href: '/levels' },
    { name: 'Blog', href: '/blog' },
  ]

  return (
    <nav className="fixed left-0 right-0 top-6 z-50 px-4 transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto">
        <div className={cn(
          "flex justify-between items-center h-20 px-8 rounded-full border transition-all duration-300",
          isScrolled 
            ? "border-white/[0.12] bg-black/[0.5] backdrop-blur-3xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]" 
            : "border-white/[0.08] bg-black/[0.25] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        )}>
          
          <Link href="/" className="flex items-center gap-2 group shrink-0 relative pt-2">
            <div className="absolute -top-[30px] -left-4 w-[180px] h-[110px] z-20 pointer-events-none">
              <Image 
                src="/forke-assets/nav_peeking_forky.png" 
                alt="Forke Logo" 
                fill
                className="object-contain"
              />
            </div>
            <div className="w-[160px] h-[40px]" /> {/* Spacer for the absolute mascot */}
            <span className="font-serif text-5xl text-white font -ml-6 relative z-10">
              Forke
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-[11px] font-black text-muted hover:text-white transition-colors tracking-[0.15em] uppercase"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Right: CTA Section */}
          <div className="flex items-center gap-4 shrink-0">
            {isLoggedIn ? (
              <Button 
                variant="primary" 
                className="rounded-full px-8 py-2.5 h-auto text-[11px] font-black tracking-widest uppercase shadow-glow-sm bg-accent text-bg" 
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <Button 
                variant="primary" 
                className="rounded-full px-8 py-2.5 h-auto text-[11px] font-black tracking-widest uppercase shadow-glow-sm bg-accent text-bg" 
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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-bg border-b border-border px-4 py-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300 mt-2 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-lg font-medium text-muted hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" className="w-full rounded-full" onClick={() => { setIsMobileMenuOpen(false); router.push('/register'); }}>
              Post a Task
            </Button>
            {isLoggedIn ? (
              <Button variant="primary" className="w-full rounded-full" onClick={() => { setIsMobileMenuOpen(false); router.push('/dashboard'); }}>
                Dashboard
              </Button>
            ) : (
              <Button variant="primary" className="w-full rounded-full" onClick={() => { setIsMobileMenuOpen(false); router.push('/register'); }}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
