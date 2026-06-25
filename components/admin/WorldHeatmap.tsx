'use client'

import React, { useState } from 'react'

// Self-contained world heatmap — NO map library / npm dependency.
// A faint equirectangular world silhouette (background continents) with a "hotspot"
// bubble per country, positioned by real lat/long, sized + shaded by click count.
// Instant custom hover tooltip (no native-title delay).

type CountryDatum = { country: string; clicks: number }

// ISO-2 -> { name, lat, lon } for countries we may receive. Easy to extend.
const COUNTRY_META: Record<string, { name: string; lat: number; lon: number }> = {
  IN: { name: 'India', lat: 22, lon: 79 },
  US: { name: 'United States', lat: 39, lon: -98 },
  GB: { name: 'United Kingdom', lat: 54, lon: -2 },
  DE: { name: 'Germany', lat: 51, lon: 10 },
  AE: { name: 'UAE', lat: 24, lon: 54 },
  CA: { name: 'Canada', lat: 56, lon: -106 },
  SG: { name: 'Singapore', lat: 1.3, lon: 103.8 },
  FR: { name: 'France', lat: 46, lon: 2 },
  AU: { name: 'Australia', lat: -25, lon: 133 },
  BR: { name: 'Brazil', lat: -10, lon: -55 },
  JP: { name: 'Japan', lat: 36, lon: 138 },
  NL: { name: 'Netherlands', lat: 52, lon: 5 },
  PK: { name: 'Pakistan', lat: 30, lon: 70 },
  NG: { name: 'Nigeria', lat: 9, lon: 8 },
  ID: { name: 'Indonesia', lat: -2, lon: 118 },
  unknown: { name: 'Unknown', lat: 0, lon: 0 },
}

// Equirectangular projection: lon [-180,180] -> x [0,360], lat [90,-90] -> y [0,180].
function project(lat: number, lon: number) {
  return { x: (lon + 180) * (360 / 360), y: (90 - lat) * (180 / 180) }
}

// A very compact, low-detail world silhouette (rough continent blobs) just for visual
// grounding behind the hotspots. Coordinates are in the 360x180 equirectangular space.
const CONTINENTS =
  // N. America
  'M40,38 L95,30 L120,55 L95,95 L70,100 L55,75 Z ' +
  // S. America
  'M95,110 L120,105 L130,150 L108,178 L98,150 Z ' +
  // Europe
  'M165,35 L200,30 L205,60 L175,68 L165,50 Z ' +
  // Africa
  'M165,75 L210,72 L220,120 L190,160 L172,120 Z ' +
  // Asia
  'M210,30 L320,25 L335,80 L270,95 L215,70 Z ' +
  // Australia
  'M300,130 L335,128 L340,158 L305,160 Z'

export default function WorldHeatmap({ data }: { data: CountryDatum[] }) {
  const [hover, setHover] = useState<{ name: string; clicks: number; x: number; y: number } | null>(null)

  if (data.length === 0) {
    return <p className="text-xs text-[var(--color-text-muted)] py-6 text-center">No geo data yet (needs edge geo headers in production).</p>
  }

  const max = Math.max(...data.map((d) => d.clicks), 1)
  // Drop "unknown"/origin (0,0) from the plotted bubbles but keep it in the legend list.
  const plotted = data.filter((d) => COUNTRY_META[d.country] && d.country !== 'unknown')

  return (
    <div>
      <div className="relative w-full rounded-lg bg-white/[0.015] border border-[var(--color-border)] overflow-hidden">
        <svg viewBox="0 0 360 180" className="w-full h-auto block" preserveAspectRatio="xMidYMid meet">
          {/* background continents */}
          <path d={CONTINENTS} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          {/* hotspots */}
          {plotted.map((d) => {
            const meta = COUNTRY_META[d.country]
            const { x, y } = project(meta.lat, meta.lon)
            const t = d.clicks / max
            const r = 3 + t * 9 // radius scales with clicks
            const opacity = 0.25 + t * 0.6
            return (
              <g key={d.country}>
                <circle cx={x} cy={y} r={r + 2} fill="var(--color-accent, #ff7a00)" opacity={opacity * 0.25} />
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="var(--color-accent, #ff7a00)"
                  opacity={opacity}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="0.4"
                  className="cursor-pointer"
                  onMouseEnter={() => setHover({ name: meta.name, clicks: d.clicks, x: (x / 360) * 100, y: (y / 180) * 100 })}
                  onMouseLeave={() => setHover(null)}
                />
              </g>
            )
          })}
        </svg>

        {/* instant tooltip */}
        {hover && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-[var(--color-border)] bg-[#111] px-2.5 py-1.5 text-[11px] font-mono text-white shadow-lg"
            style={{ left: `${hover.x}%`, top: `${hover.y}%` }}
          >
            <span className="text-white/90">{hover.name}</span>
            <span className="text-accent"> · {hover.clicks}</span>
            <span className="text-[var(--color-text-muted)]"> click{hover.clicks === 1 ? '' : 's'}</span>
          </div>
        )}
      </div>

      {/* compact legend list under the map (also covers 'unknown') */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {data.map((d) => {
          const meta = COUNTRY_META[d.country]
          const pct = Math.round((d.clicks / data.reduce((a, r) => a + r.clicks, 0)) * 100)
          return (
            <div key={d.country} className="flex items-center gap-1.5 text-xs">
              <span
                className="inline-block w-2 h-2 rounded-full bg-accent"
                style={{ opacity: 0.3 + (d.clicks / max) * 0.7 }}
              />
              <span className="font-mono text-white/70">{meta?.name || d.country.toUpperCase()}</span>
              <span className="font-mono text-[var(--color-text-muted)]">{d.clicks} ({pct}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
