'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Copy, Check, ChevronDown, FileText, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * Linear-style "Copy page" split button (see docs top bar).
 *
 *   ┌──────────────┬───┐
 *   │  Copy page   │ ▾ │
 *   └──────────────┴───┘
 *
 * The left half copies the page's Markdown to the clipboard. The chevron opens
 * a menu with:
 *   • Copy page         — copy page as Markdown for LLMs
 *   • View as Markdown  — open the raw .md view in a new tab
 *
 * Intentionally NO light/dark theme toggle.
 */
export default function CopyPageButton({
  markdown,
  viewHref,
}: {
  /** The Markdown source for the current page. */
  markdown: string
  /** Route that serves this page as raw Markdown (opened in a new tab). */
  viewHref: string
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — fail silently */
    }
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex items-stretch rounded-lg border border-white/[0.1] bg-white/[0.03] text-[13px] text-white/75 transition-colors hover:border-white/[0.16]">
        {/* Primary action — copy markdown */}
        <button
          onClick={copy}
          className="flex items-center gap-2 rounded-l-lg px-3 py-1.5 transition-colors hover:bg-white/[0.04] hover:text-white"
          aria-label="Copy page as Markdown"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
          ) : (
            <Copy className="h-3.5 w-3.5" strokeWidth={1.7} />
          )}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy page'}</span>
        </button>

        {/* Divider + chevron toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'flex items-center rounded-r-lg border-l border-white/[0.1] px-1.5 transition-colors hover:bg-white/[0.04] hover:text-white',
            open && 'bg-white/[0.05] text-white'
          )}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Page options"
        >
          <ChevronDown
            className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
            strokeWidth={1.7}
          />
        </button>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-white/[0.1] bg-[#0c0c0f] p-1.5 shadow-2xl shadow-black/40"
        >
          <button
            onClick={copy}
            role="menuitem"
            className="flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <Copy className="mt-0.5 h-4 w-4 shrink-0 text-white/55" strokeWidth={1.7} />
            <span className="min-w-0">
              <span className="block text-[13.5px] font-medium text-white">Copy page</span>
              <span className="block text-[12px] leading-snug text-white/45">
                Copy page as Markdown for LLMs
              </span>
            </span>
          </button>

          <a
            href={viewHref}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-white/55" strokeWidth={1.7} />
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-[13.5px] font-medium text-white">
                View as Markdown
                <ExternalLink className="h-3 w-3 text-white/40" strokeWidth={1.7} />
              </span>
              <span className="block text-[12px] leading-snug text-white/45">
                View this page as plain text
              </span>
            </span>
          </a>
        </div>
      )}
    </div>
  )
}
