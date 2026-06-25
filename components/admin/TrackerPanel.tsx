'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { MousePointerClick, Users, Target, Globe, FileText, ExternalLink, RefreshCw } from 'lucide-react'
import { getTrackerData, getSignupSourceBreakdown, type TrackerData } from '@/lib/admin-dashboard-actions'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'

const RANGES: { label: string; days: number }[] = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
]

const EMPTY: TrackerData = {
  stats: { clicks: 0, visitors: 0, conversions: 0, rate: 0 },
  series: [], funnel: [], landingPages: [], referrers: [], countries: [], recent: [],
}

/** Shorten a referrer/URL to host + truncated path for compact display. */
function shortUrl(url: string): string {
  try {
    const u = new URL(url)
    const tail = (u.pathname + u.search).replace(/\/$/, '')
    return u.host + (tail && tail !== '/' ? tail.slice(0, 24) : '')
  } catch {
    return url.slice(0, 36)
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/[0.018] border border-[var(--color-border)] p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        {subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

/** A simple horizontal-bar list (label · bar · count), the project's existing breakdown idiom. */
function BarList({ rows, emptyHint }: { rows: { label: string; count: number; title?: string }[]; emptyHint: string }) {
  if (rows.length === 0) {
    return <p className="text-xs text-[var(--color-text-muted)] py-4 text-center">{emptyHint}</p>
  }
  const max = Math.max(...rows.map((r) => r.count), 1)
  return (
    <div className="space-y-2.5">
      {rows.map((r, i) => (
        <div key={`${r.label}-${i}`} className="flex items-center gap-3">
          <span className="w-40 shrink-0 text-xs font-mono text-white/70 truncate" title={r.title || r.label}>{r.label}</span>
          <div className="flex-grow h-2 rounded-full bg-white/[0.04] overflow-hidden">
            <div className="h-full rounded-full bg-accent/70" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
          <span className="w-12 shrink-0 text-right text-xs font-mono text-white/80">{r.count}</span>
        </div>
      ))}
    </div>
  )
}

export default function TrackerPanel() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState<TrackerData>(EMPTY)
  const [isLoading, setIsLoading] = useState(true)
  // All-time signups by source (real conversions, predates the click tracker).
  const [signupSources, setSignupSources] = useState<{ source: string; count: number }[]>([])
  const [signupTotal, setSignupTotal] = useState(0)

  const load = useCallback(async (d: number) => {
    setIsLoading(true)
    try {
      const res = await getTrackerData(d)
      setData(res.success ? res.data : EMPTY)
    } catch {
      setData(EMPTY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load(days) }, [days, load])

  // Historical signups-by-source loads once (it's all-time, not range-dependent).
  useEffect(() => {
    getSignupSourceBreakdown()
      .then((res) => { if (res.success) { setSignupSources(res.breakdown); setSignupTotal(res.total) } })
      .catch(() => {})
  }, [])

  const { stats, series, funnel, landingPages, referrers, countries, recent } = data

  return (
    <div className="flex flex-col min-h-0 flex-grow gap-4 overflow-y-auto pr-1">
      {/* Header + range selector */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-base font-semibold text-white">Tracker</h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Link clicks, sources & conversions from your <span className="font-mono text-white/70">?source=</span> tags.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-[var(--color-border)] p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => setDays(r.days)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-mono transition-colors',
                  days === r.days ? 'bg-white/[0.06] text-white' : 'text-[var(--color-text-muted)] hover:text-white'
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => load(days)}
            className="h-7 w-7 grid place-items-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-white/[0.05] hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <>
          {/* Headline stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            {[
              { icon: MousePointerClick, label: 'Clicks', value: stats.clicks.toLocaleString() },
              { icon: Users, label: 'Unique visitors', value: stats.visitors.toLocaleString() },
              { icon: Target, label: 'Signups (from clicks)', value: stats.conversions.toLocaleString() },
              { icon: Target, label: 'Conversion rate', value: `${stats.rate}%` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/[0.018] border border-[var(--color-border)] px-4 py-3">
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <s.icon className="w-3.5 h-3.5" />
                  <span className="text-[11px] uppercase tracking-wide">{s.label}</span>
                </div>
                <p className="text-2xl font-mono text-white mt-1.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Clicks over time */}
          <Card title="Clicks over time" subtitle={`Daily tracked clicks · last ${days} days`}>
            {series.length > 0 ? (
              <div>
                <div className="flex items-end gap-[3px] h-32">
                  {(() => {
                    const max = Math.max(...series.map((d) => d.clicks), 1)
                    return series.map((d) => (
                      <div
                        key={d.day}
                        className="flex-1 min-w-[2px] rounded-t bg-accent/60 hover:bg-accent transition-colors"
                        style={{ height: `${Math.max((d.clicks / max) * 100, 2)}%` }}
                        title={`${d.day}: ${d.clicks} click${d.clicks === 1 ? '' : 's'}`}
                      />
                    ))
                  })()}
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono text-[var(--color-text-muted)]">
                  <span>{series[0]?.day}</span>
                  <span>{series[series.length - 1]?.day}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)] py-8 text-center">
                No clicks tracked yet. Share a link like <span className="font-mono text-white/70">forke.space/?source=twitter</span> to start collecting.
              </p>
            )}
          </Card>

          {/* Per-source funnel */}
          <Card title="Click → signup funnel" subtitle="Per source: total clicks (grey) vs. signups they produced (accent)">
            {funnel.length > 0 ? (
              <div className="space-y-2.5">
                {(() => {
                  const maxClicks = Math.max(...funnel.map((f) => f.clicks), 1)
                  return funnel.map((f) => (
                    <div key={f.source} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-xs font-mono text-white/70 truncate" title={f.source}>{f.source}</span>
                      <div className="flex-grow h-2 rounded-full bg-white/[0.04] overflow-hidden relative">
                        <div className="h-full rounded-full bg-white/15" style={{ width: `${(f.clicks / maxClicks) * 100}%` }} />
                        <div className="h-full rounded-full bg-accent/80 absolute top-0 left-0" style={{ width: `${(f.conversions / maxClicks) * 100}%` }} />
                      </div>
                      <span className="w-36 shrink-0 text-right text-xs font-mono text-white/80">
                        {f.conversions}/{f.clicks} <span className="text-[var(--color-text-muted)]">({f.rate}%)</span>
                      </span>
                    </div>
                  ))
                })()}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)] py-4 text-center">No source data yet.</p>
            )}
          </Card>

          {/* All-time signups by source — real conversions, predates the click tracker.
              Shown separately so it's never confused with live click data. */}
          {signupSources.length > 0 && (
            <Card
              title="All-time signups by source"
              subtitle={`${signupTotal} total signups across users + subscribers · conversions only (clicks not tracked before this feature)`}
            >
              <BarList
                rows={signupSources.map((s) => ({ label: s.source, count: s.count }))}
                emptyHint="No signups yet."
              />
            </Card>
          )}

          {/* Landing pages + Referrers side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="Top landing pages" subtitle="First page visitors hit">
              <div className="flex items-center gap-2 mb-3 text-[var(--color-text-muted)]"><FileText className="w-3.5 h-3.5" /></div>
              <BarList
                rows={landingPages.map((p) => ({ label: p.path, count: p.clicks }))}
                emptyHint="No landing data yet."
              />
            </Card>
            <Card title="Top referrers" subtitle="External sites sending traffic">
              <div className="flex items-center gap-2 mb-3 text-[var(--color-text-muted)]"><ExternalLink className="w-3.5 h-3.5" /></div>
              <BarList
                rows={referrers.map((r) => ({ label: shortUrl(r.referrer), count: r.clicks, title: r.referrer }))}
                emptyHint="No external referrers yet — most traffic is direct or tagged."
              />
            </Card>
          </div>

          {/* Geo + recent feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="Top countries" subtitle="Visitor geography (coarse)">
              <div className="flex items-center gap-2 mb-3 text-[var(--color-text-muted)]"><Globe className="w-3.5 h-3.5" /></div>
              <BarList
                rows={countries.map((c) => ({ label: c.country.toUpperCase(), count: c.clicks }))}
                emptyHint="No geo data yet (needs edge geo headers in production)."
              />
            </Card>
            <Card title="Recent clicks" subtitle="Live feed — confirms tracking is firing">
              {recent.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {recent.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/[0.03] border border-[var(--color-border)] font-mono text-white/70 shrink-0">
                        {r.source}
                      </span>
                      <span className="font-mono text-white/50 truncate flex-grow" title={r.referrer || r.landingPath || ''}>
                        {r.landingPath || '/'}{r.country ? ` · ${r.country.toUpperCase()}` : ''}
                      </span>
                      <span className="font-mono text-[var(--color-text-muted)] shrink-0">{timeAgo(r.createdAt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--color-text-muted)] py-4 text-center">No clicks recorded yet.</p>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
