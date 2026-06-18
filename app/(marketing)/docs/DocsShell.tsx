'use client'

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Search, Menu, X, ArrowLeft } from 'lucide-react'
import { SECTIONS } from './content'
import { cn } from '@/lib/utils/cn'
import CopyPageButton from './CopyPageButton'

/**
 * Linear-style docs shell: fixed left sidebar (collapsible groups + search),
 * fixed top bar with breadcrumb, independently scrollable content column. The
 * right-rail table of contents is rendered per-page (see DocToc) so it can
 * track the specific article's headings.
 */

const NAV_STATE_KEY = 'forke-docs-nav-open'

/**
 * Per-section collapsed/expanded state that survives client-side navigation
 * within the docs (sessionStorage). The shell remounts on every page change,
 * so without this the open groups would reset each time.
 *
 * Exposed as a tiny external store so components can read it via
 * `useSyncExternalStore` — that gives a stable server snapshot (no hydration
 * mismatch) and live client updates without calling setState inside an effect.
 */
const EMPTY_STATE: Record<string, boolean> = {}

const navStore = (() => {
  const listeners = new Set<() => void>()
  let cache: Record<string, boolean> = EMPTY_STATE

  function read(): Record<string, boolean> {
    if (typeof window === 'undefined') return EMPTY_STATE
    try {
      const raw = sessionStorage.getItem(NAV_STATE_KEY)
      const parsed = raw ? (JSON.parse(raw) as Record<string, boolean>) : EMPTY_STATE
      // Keep a stable reference unless the contents actually changed, so
      // getSnapshot doesn't loop.
      if (JSON.stringify(parsed) !== JSON.stringify(cache)) cache = parsed
      return cache
    } catch {
      return cache
    }
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: read,
    getServerSnapshot: () => EMPTY_STATE,
    set(id: string, open: boolean) {
      if (typeof window === 'undefined') return
      try {
        const next = { ...read(), [id]: open }
        sessionStorage.setItem(NAV_STATE_KEY, JSON.stringify(next))
        cache = next
      } catch {
        /* storage unavailable — degrade gracefully */
      }
      listeners.forEach((l) => l())
    },
  }
})()

function useActiveSlug() {
  const pathname = usePathname()
  // /docs or /docs/<slug>
  const parts = pathname.split('/').filter(Boolean)
  return parts[0] === 'docs' ? parts[1] ?? null : null
}

function Sidebar({
  onNavigate,
  inputId = 'docs-search',
}: {
  onNavigate?: () => void
  inputId?: string
}) {
  const activeSlug = useActiveSlug()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SECTIONS
    return SECTIONS.map((s) => ({
      ...s,
      articles: s.articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      ),
    })).filter((s) => s.articles.length > 0)
  }, [query])

  return (
    <div className="flex h-full flex-col">
      {/* Brand — logo (→ home) · divider · Docs (→ /docs) */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <Link
          href="/"
          onClick={onNavigate}
          aria-label="Forke home"
          className="shrink-0 transition-opacity hover:opacity-80 text-xl font-semibold tracking-[-0.04em] text-white"
        >
          forke<span className="text-accent">*</span>
        </Link>
        <span aria-hidden className="h-5 w-px bg-white/[0.12]" />
        <Link
          href="/docs"
          onClick={onNavigate}
          className="text-[16px] font-medium tracking-[-0.01em] text-white transition-colors hover:text-white/80"
        >
          Docs
        </Link>
      </div>

      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
          <input
            id={inputId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs"
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-white/30 focus:border-accent/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-4 flex-1 overflow-y-auto px-2 pb-8 docs-scroll">
        {filtered.map((section) => (
          <NavGroup key={section.id} section={section} activeSlug={activeSlug} onNavigate={onNavigate} />
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-[13px] text-white/30">No matches.</p>
        )}
      </nav>

      {/* Footer link back to product */}
      <div className="border-t border-white/[0.06] px-4 py-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 font-mono text-[12px] text-white/45 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          back to forke
        </Link>
      </div>
    </div>
  )
}

function NavGroup({
  section,
  activeSlug,
  onNavigate,
}: {
  section: (typeof SECTIONS)[number]
  activeSlug: string | null
  onNavigate?: () => void
}) {
  const containsActive = section.articles.some((a) => a.slug === activeSlug)
  const fallbackOpen = Boolean(section.defaultOpen) || containsActive

  // Persisted open/closed map. Server snapshot is empty → SSR & the hydration
  // render both use the fallback (no mismatch); after mount the client snapshot
  // reflects sessionStorage and the saved state is restored.
  const saved = useSyncExternalStore(
    navStore.subscribe,
    navStore.getSnapshot,
    navStore.getServerSnapshot
  )
  const hasSaved = Object.prototype.hasOwnProperty.call(saved, section.id)
  // The active group is always open; otherwise honour the saved value, else the
  // default. This is derived state — no effect, no setState-in-effect.
  const open = containsActive ? true : hasSaved ? saved[section.id] : fallbackOpen

  // Suppress the expand/collapse transition until after the first paint, so a
  // restored-from-storage group snaps into place instead of animating on load.
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const toggle = useCallback(() => {
    navStore.set(section.id, !open)
  }, [section.id, open])

  return (
    <div className="mb-1">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/[0.03]"
      >
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white/40">
          {section.label}
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-white/30',
            animate && 'transition-transform',
            open ? '' : '-rotate-90'
          )}
        />
      </button>
      <div
        className={cn(
          'grid',
          animate && 'transition-all duration-200',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <ul className="space-y-0.5 py-1">
            {section.articles.map((a) => {
              const Icon = a.icon
              const active = a.slug === activeSlug
              return (
                <li key={a.slug}>
                  <Link
                    href={`/docs/${a.slug}`}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13.5px] transition-colors',
                      active
                        ? 'bg-accent/[0.1] text-white'
                        : 'text-white/55 hover:bg-white/[0.03] hover:text-white/90'
                    )}
                  >
                    <Icon
                      className={cn('h-4 w-4 shrink-0', active ? 'text-accent' : 'text-white/35')}
                      strokeWidth={1.7}
                    />
                    <span className="truncate">{a.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

function focusSidebarSearch() {
  // Prefer the mobile drawer input when it's mounted (drawer open); otherwise
  // fall back to the always-mounted desktop sidebar input.
  const mobile = document.getElementById('docs-search-mobile') as HTMLInputElement | null
  const desktop = document.getElementById('docs-search') as HTMLInputElement | null
  const input = mobile ?? desktop
  if (input) {
    input.focus()
    input.scrollIntoView({ block: 'nearest' })
  }
}

export default function DocsShell({
  breadcrumb,
  copy,
  isLoggedIn = false,
  children,
}: {
  breadcrumb?: { label: string; href?: string }[]
  /** Drives the "Copy page" split button in the top bar. */
  copy?: { markdown: string; viewHref: string }
  /** When true, the top bar shows "Dashboard" instead of "Sign up". */
  isLoggedIn?: boolean
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Cmd/Ctrl+K focuses the docs search.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setMobileOpen(false)
        focusSidebarSearch()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-accent selection:text-white">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/[0.06] bg-[#070708] lg:block">
        <Sidebar />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-white/[0.08] bg-[#070708]">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 z-10 rounded-lg p-1.5 text-white/50 hover:bg-white/[0.06]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} inputId="docs-search-mobile" />
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        {/* Top bar — fixed across the content column; the page scrolls beneath it */}
        <header className="fixed inset-x-0 top-0 z-20 border-b border-white/[0.06] bg-[#050505]/85 backdrop-blur-xl lg:left-72">
          <div className="flex h-14 items-center gap-3 px-5 md:px-8">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-1.5 text-white/60 hover:bg-white/[0.06] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb - Desktop */}
            <nav className="hidden lg:flex min-w-0 items-center gap-2 text-[13px]">
              <Link
                href="/docs"
                className="shrink-0 text-white/45 transition-colors hover:text-white"
              >
                Docs
              </Link>
              {breadcrumb?.map((b) => (
                <React.Fragment key={b.label}>
                  <span className="text-white/20">/</span>
                  {b.href ? (
                    <Link
                      href={b.href}
                      className="shrink-0 text-white/45 transition-colors hover:text-white"
                    >
                      {b.label}
                    </Link>
                  ) : (
                    <span className="truncate text-white/80">{b.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* Active Heading - Mobile */}
            <div className="flex lg:hidden min-w-0 items-center text-[14px] font-semibold text-white truncate">
              {breadcrumb && breadcrumb.length > 0 ? (
                breadcrumb[breadcrumb.length - 1].label
              ) : (
                "Docs"
              )}
            </div>

            {/* Right cluster */}
            <div className="ml-auto flex items-center gap-2.5">
              {/* Copy page split button (Image 3) — no theme toggle */}
              {copy && <CopyPageButton markdown={copy.markdown} viewHref={copy.viewHref} />}

              {/* Auth CTA — Dashboard when signed in, otherwise Sign up */}
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-white px-3.5 py-1.5 text-[13px] font-semibold tracking-tight text-[#0a0a0a] transition-colors hover:bg-white/90"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="rounded-lg bg-white px-3.5 py-1.5 text-[13px] font-semibold tracking-tight text-[#0a0a0a] transition-colors hover:bg-white/90"
                >
                  Sign up
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Offset for the fixed top bar (h-14 = 3.5rem) */}
        <div className="pt-14">{children}</div>
      </div>
    </div>
  )
}
