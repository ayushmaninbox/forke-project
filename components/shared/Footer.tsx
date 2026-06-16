'use client'

import React, { useState, useEffect } from 'react'

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

  const columns: { heading: string; links: { name: string; href: string; external?: boolean }[] }[] = [
    {
      heading: 'product',
      links: [
        { name: 'whats-forke', href: '/whats-forke' },
        ...(!showWaitlisterView ? [{ name: 'bounties', href: '/tasks' }] : []),
        { name: 'levels', href: '/levels' },
        { name: 'changelog', href: '/changelog' },
      ],
    },
    {
      heading: 'company',
      links: [
        { name: 'blogs', href: '/blogs' },
        { name: 'contact', href: '/contact' },
      ],
    },
    {
      heading: 'legal',
      links: [
        { name: 'privacy', href: '/privacy' },
        { name: 'terms', href: '/terms' },
        { name: 'refunds', href: '/refund' },
      ],
    },
  ]

  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/[0.07]" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-7xl px-5 pt-16 md:px-10 md:pt-20 min-[1920px]:max-w-[1920px]">
        <div className="grid gap-8 md:gap-12 sm:grid-cols-2 md:grid-cols-[1.8fr_1fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="inline-flex items-center transition-opacity hover:opacity-80">
              <img
                src="/forke-assets/forke_logo.png"
                alt="Forke Logo"
                className="h-14 w-14 object-contain"
              />
              <span className="text-[26px] font-semibold tracking-[-0.04em] text-white">
                forke<span className="text-accent">*</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-white/40">
              The micro-task marketplace where Indian developers earn real money by
              shipping real code.
            </p>
            <p className="mt-5 font-mono text-[11px] text-white/25">
              {'//'} prove skill by shipping
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/30">
                {col.heading}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="font-mono text-[13px] text-white/50 transition-colors hover:text-white"
                    >
                      {link.name}
                      {link.external && ' ↗'}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect column */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/30">
              connect
            </h4>
            <div className="mt-5 flex gap-3">
              <a
                href="https://www.linkedin.com/company/forke/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/50 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://github.com/forke-org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/50 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="mailto:support@forke.space"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/50 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/[0.05] py-7 font-mono text-[11px] text-white/30 md:flex-row">
          <span>© 2026 forke — all rights reserved</span>
          <span>made in india · paid in rupees</span>
        </div>
      </div>

      {/* Giant outlined wordmark, clipped at the page edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative mx-auto h-[16vw] max-w-7xl select-none overflow-hidden md:h-[13vw] min-[1920px]:max-w-[1920px]"
      >
        <span className="text-outline absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap text-[20vw] font-medium leading-[0.78] tracking-[-0.05em] md:text-[16vw]">
          forke<span className="[-webkit-text-stroke:1px_rgba(255,122,0,0.55)]">*</span>
        </span>
      </div>
    </footer>
  )
}
