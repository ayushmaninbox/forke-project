'use client'

import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Search } from 'lucide-react'

// Composed geo view inspired by the "Product Growth by Countries" layout:
//   left  = 3D globe (react-globe.gl), countries shaded by click volume
//   right = searchable, paginated country table with flag, clicks, and a % ring.
// The globe is loaded client-only (WebGL + window) so it never SSRs.

type CountryDatum = { country: string; clicks: number }

const GlobeView = dynamic(() => import('@/components/admin/GlobeView'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-h-[460px] grid place-items-center text-xs text-[var(--color-text-muted)]">
      Loading globe…
    </div>
  ),
})

// ISO-2 -> readable name. Falls back to the raw code for anything unmapped.
const ISO2_TO_NAME: Record<string, string> = {
  IN: 'India', US: 'United States', GB: 'United Kingdom', DE: 'Germany', AE: 'United Arab Emirates',
  CA: 'Canada', SG: 'Singapore', FR: 'France', AU: 'Australia', BR: 'Brazil', JP: 'Japan',
  NL: 'Netherlands', PK: 'Pakistan', NG: 'Nigeria', ID: 'Indonesia', CN: 'China', RU: 'Russia',
  ZA: 'South Africa', ES: 'Spain', IT: 'Italy', SE: 'Sweden', DK: 'Denmark', CH: 'Switzerland',
}

// Emoji flag from an ISO-2 code (regional indicator letters) — no flag-image assets needed.
function flagEmoji(iso: string): string {
  if (!/^[A-Za-z]{2}$/.test(iso)) return '🌐'
  const A = 0x1f1e6
  const up = iso.toUpperCase()
  return String.fromCodePoint(A + (up.charCodeAt(0) - 65), A + (up.charCodeAt(1) - 65))
}

const PAGE_SIZE = 8

/** A small SVG ring showing a country's share of total clicks. */
function PercentRing({ pct }: { pct: number }) {
  const r = 8
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className="shrink-0">
      <circle cx="11" cy="11" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
      <circle
        cx="11" cy="11" r={r} fill="none" stroke="var(--color-accent, #ff7a00)" strokeWidth="2.5"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round" transform="rotate(-90 11 11)"
      />
    </svg>
  )
}

export default function WorldHeatmap({ data }: { data: CountryDatum[] }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [hover, setHover] = useState<{ name: string; clicks: number } | null>(null)

  const total = useMemo(() => data.reduce((a, r) => a + r.clicks, 0), [data])

  const rows = useMemo(() => {
    const withMeta = data
      .map((d) => ({
        iso: d.country,
        name: ISO2_TO_NAME[d.country] || d.country.toUpperCase(),
        clicks: d.clicks,
        pct: total > 0 ? Math.round((d.clicks / total) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
    const q = query.trim().toLowerCase()
    return q ? withMeta.filter((r) => r.name.toLowerCase().includes(q) || r.iso.toLowerCase().includes(q)) : withMeta
  }, [data, total, query])

  if (data.length === 0) {
    return <p className="text-xs text-[var(--color-text-muted)] py-6 text-center">No geo data yet (needs edge geo headers in production).</p>
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const slice = rows.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Globe */}
      <div className="relative rounded-lg bg-white/[0.015] border border-[var(--color-border)] p-2 min-h-[360px] flex items-center justify-center">
        <GlobeView data={data} onHover={setHover} />
        {hover && (
          <div className="pointer-events-none absolute top-3 left-3 z-10 rounded-md border border-[var(--color-border)] bg-[#111] px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono text-white/90">
              <span className="text-base leading-none">{(() => {
                const iso = Object.keys(ISO2_TO_NAME).find((k) => ISO2_TO_NAME[k] === hover.name)
                return iso ? flagEmoji(iso) : '🌐'
              })()}</span>
              {hover.name}
            </div>
            <div className="text-lg font-mono text-white mt-0.5">{hover.clicks.toLocaleString()} <span className="text-[11px] text-[var(--color-text-muted)]">clicks</span></div>
          </div>
        )}
        {/* legend */}
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-3 text-[10px] font-mono text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,122,0,0.95)' }} />high</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,122,0,0.45)' }} />mid</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />none</span>
        </div>
      </div>

      {/* Country table */}
      <div className="flex flex-col">
        {/* search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0) }}
            placeholder="Search countries…"
            className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg pl-9 pr-3 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-accent/40 transition-colors"
          />
        </div>

        {/* header */}
        <div className="flex items-center px-2 pb-2 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
          <span className="flex-grow">Country</span>
          <span className="w-16 text-right">Clicks</span>
          <span className="w-16 text-right">Percent</span>
        </div>

        {/* rows */}
        <div className="flex-grow">
          {slice.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)] py-6 text-center">No countries match “{query}”.</p>
          ) : (
            slice.map((r) => (
              <div key={r.iso} className="flex items-center px-2 py-2 rounded-md hover:bg-white/[0.025] transition-colors">
                <span className="text-lg leading-none mr-2.5 shrink-0">{flagEmoji(r.iso)}</span>
                <span className="flex-grow text-[13px] text-white/90 truncate" title={r.name}>{r.name}</span>
                <span className="w-16 text-right text-[13px] font-mono text-white/80">{r.clicks.toLocaleString()}</span>
                <span className="w-16 flex items-center justify-end gap-1.5">
                  <span className="text-[12px] font-mono text-white/60">{r.pct}%</span>
                  <PercentRing pct={r.pct} />
                </span>
              </div>
            ))
          )}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--color-border)]">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="text-[11px] font-mono text-[var(--color-text-muted)] hover:text-white disabled:opacity-30 transition-colors"
            >← Prev</button>
            <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
              showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, rows.length)} of {rows.length}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="text-[11px] font-mono text-[var(--color-text-muted)] hover:text-white disabled:opacity-30 transition-colors"
            >Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}
