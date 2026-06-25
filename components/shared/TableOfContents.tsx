'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'

export type TocItem = {
  id: string
  label: string
  depth?: number
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null)

  useEffect(() => {
    if (items.length === 0) return

    const ids = items.map((it) => it.id)
    // offset 140 matches our scroll-mt-28 (112px) plus breathing room for navbar trigger
    const offset = 140

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
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id
        } else {
          break
        }
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
    <nav className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto pb-6 w-full docs-scroll">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-white/35">
        On this page
      </p>
      <ul className="relative border-l border-white/[0.08]">
        {items.map((it) => {
          const isActive = active === it.id
          return (
            <li key={it.id} className="relative">
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
