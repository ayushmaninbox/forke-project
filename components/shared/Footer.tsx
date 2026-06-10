'use client'

import React, { useState, useEffect } from 'react'
import { Mail } from 'lucide-react'

export default function Footer() {
  const [hasSiteAccess, setHasSiteAccess] = useState(false)
  const [waitlistActive, setWaitlistActive] = useState(true)

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      if (typeof document === 'undefined') return null
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null
      return null
    }

    setHasSiteAccess(getCookie('site_access_public') === 'true')
    setWaitlistActive(getCookie('waitlist_active') === 'true')
  }, [])

  const showWaitlisterView = waitlistActive && !hasSiteAccess

  return (
    <footer className="relative z-10 border-t border-border overflow-hidden px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto pt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Brand */}
        <div className="space-y-6">
          <div className="flex items-center">
            <img
              src="/forke-assets/forke_logo.png"
              alt="Forke Logo"
              className="w-16 h-16 object-contain"
            />
            <div className="text-3xl font-semibold tracking-[-0.04em] text-white">
              forke<span className="text-accent">*</span>
            </div>
          </div>
          <p className="text-muted text-sm font-light leading-relaxed max-w-xs">
            Built for India&apos;s developers. The micro-task marketplace to ship real work and get paid <span className="font-serif italic text-accent">instantly.</span>
          </p>
          <p className="font-mono text-[11px] text-white/25">
            {'//'} no resumes. no interviews. just merged PRs.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="ui-eyebrow mb-6">{'//'} navigate</h4>
          <ul className="space-y-4 columns-2 gap-x-12">
            <li><a href="/whats-forke" className="font-mono text-[13px] text-muted hover:text-white transition-colors">whats-forke</a></li>
            {!showWaitlisterView && <li><a href="/tasks" className="font-mono text-[13px] text-muted hover:text-white transition-colors">bounties</a></li>}
            <li><a href="/levels" className="font-mono text-[13px] text-muted hover:text-white transition-colors">levels</a></li>
            <li><a href="/blogs" className="font-mono text-[13px] text-muted hover:text-white transition-colors">blogs</a></li>
            <li><a href="/changelog" className="font-mono text-[13px] text-muted hover:text-white transition-colors">changelog</a></li>
            <li><a href="/contact" className="font-mono text-[13px] text-muted hover:text-white transition-colors">contact</a></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="ui-eyebrow mb-6">{'//'} connect</h4>
          <div className="flex items-center gap-4 flex-wrap">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/forke/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors p-2.5 bg-white/[0.03] rounded-lg border border-white/10 hover:border-accent/30 flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            {/* GitHub */}
            <a
              href="https://github.com/forke-org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors p-2.5 bg-white/[0.03] rounded-lg border border-white/10 hover:border-accent/30 flex items-center justify-center"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            {/* Email */}
            <a
              href="mailto:support@forke.space"
              className="text-muted hover:text-accent transition-colors p-2.5 bg-white/[0.03] rounded-lg border border-white/10 hover:border-accent/30 flex items-center justify-center"
              aria-label="Email support"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2.5 font-mono text-[11px] text-white/35">
          <span>© 2026 forke — all rights reserved</span>
        </div>
        <div className="flex gap-6 font-mono text-[11px] text-white/35 flex-wrap justify-center md:justify-end">
          <a href="/privacy" className="hover:text-white transition-colors">privacy</a>
          <a href="/terms" className="hover:text-white transition-colors">terms</a>
          <a href="/refund" className="hover:text-white transition-colors">refunds</a>
        </div>
      </div>

      {/* Giant outlined wordmark — clipped at the bottom edge */}
      <div aria-hidden="true" className="relative max-w-7xl mx-auto h-[17vw] md:h-[14vw] mt-10 select-none pointer-events-none overflow-hidden">
        <span className="absolute left-1/2 -translate-x-1/2 top-0 text-[21vw] md:text-[17.5vw] leading-[0.78] font-medium tracking-[-0.05em] text-outline whitespace-nowrap">
          forke<span className="[-webkit-text-stroke:1px_rgba(255,122,0,0.6)]">*</span>
        </span>
      </div>
    </footer>
  )
}
