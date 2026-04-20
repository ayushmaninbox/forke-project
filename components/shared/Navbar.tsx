'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useAuthModal } from '@/components/auth/AuthContext'

export default function Navbar() {
  const { openSignInModal } = useAuthModal()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="font-serif text-2xl text-[var(--color-text-primary)]">
              Fork<span className="text-accent">e</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" onClick={openSignInModal}>
              Post a Task
            </Button>
            <Button variant="primary" onClick={openSignInModal}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[var(--color-text-primary)] p-2"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[var(--color-border)] px-4 py-4 space-y-4">
          <Button variant="ghost" className="w-full justify-center" onClick={openSignInModal}>
            Post a Task
          </Button>
          <Button variant="primary" className="w-full justify-center" onClick={openSignInModal}>
            Get Started
          </Button>
        </div>
      )}
    </nav>
  )
}
