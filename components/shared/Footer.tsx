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
        { name: 'linkedin', href: 'https://www.linkedin.com/company/forke/', external: true },
        { name: 'github', href: 'https://github.com/forke-org', external: true },
        { name: 'support@forke.space', href: 'mailto:support@forke.space' },
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
      <div className="mx-auto max-w-7xl px-5 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
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
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/[0.05] py-7 font-mono text-[11px] text-white/30 md:flex-row">
          <span>© 2026 forke — all rights reserved</span>
          <span>made in india · paid in rupees</span>
        </div>
      </div>

      {/* Giant outlined wordmark, clipped at the page edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative mx-auto h-[16vw] max-w-7xl select-none overflow-hidden md:h-[13vw]"
      >
        <span className="text-outline absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap text-[20vw] font-medium leading-[0.78] tracking-[-0.05em] md:text-[16vw]">
          forke<span className="[-webkit-text-stroke:1px_rgba(255,122,0,0.55)]">*</span>
        </span>
      </div>
    </footer>
  )
}
