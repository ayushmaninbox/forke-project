'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { TocItem } from './content'

/**
 * Right-rail "On this page" with scroll-spy, Linear-style.
 *
 * A continuous faint vertical track runs down the left edge; the active item
 * paints a bright accent segment over that track and turns its label white.
 * Sub-headings (depth 2) are indented one step.
 */
export default function DocToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null)

  useEffect(() => {
    if (items.length === 0) return

    // Live scroll-spy: on every scroll, the active heading is the last one whose
    // top has crossed an offset just below the fixed top bar. A bottom-of-page
    // check guarantees the final heading highlights when you reach the end.
    const ids = items.map((it) => it.id)

    // Matches the headings' scroll-mt (scroll-mt-28 = 7rem = 112px), plus a
    // little slack, so a heading registers as active exactly when it settles at
    // the top after a click-jump or a section-to-section scroll.
    const offset = 128

    function onScroll() {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActive(ids[ids.length - 1])
        return
      }
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= offset) current = id
        else break
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  function handleClick(e: React.MouseEvent, id: string) {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    setActive(id)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
  }

  if (items.length === 0) return null

  return (
    // Pinned to the viewport: the article scrolls independently beneath it.
    // `right` tracks the right gutter of the centred max-w-6xl (72rem) content
    // column, with the 18rem sidebar offset on the left side of the page.
    <nav
      className="fixed top-[5.5rem] z-10 hidden max-h-[calc(100vh-7rem)] w-56 overflow-y-auto docs-scroll pb-6 xl:block"
      style={{ right: 'max(2.5rem, calc((100vw - 18rem - 72rem) / 2 + 2.5rem))' }}
    >
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-white/30">
        On this page
      </p>
      {/* The faint vertical track sits behind the items; each link paints its
          own segment of the indicator when active. */}
      <ul className="relative border-l border-white/[0.08]">
        {items.map((it) => {
          const isActive = active === it.id
          return (
            <li key={it.id} className="relative">
              {/* Active indicator segment, overlapping the track */}
              <span
                aria-hidden
                className={cn(
                  'absolute left-[-1px] top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full transition-colors',
                  isActive ? 'bg-accent' : 'bg-transparent'
                )}
              />
              <a
                href={`#${it.id}`}
                onClick={(e) => handleClick(e, it.id)}
                className={cn(
                  'block py-1.5 pl-4 text-[13px] leading-snug transition-colors',
                  it.depth === 2 && 'pl-8',
                  isActive
                    ? 'font-medium text-white'
                    : 'text-white/40 hover:text-white/75'
                )}
              >
                {it.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
