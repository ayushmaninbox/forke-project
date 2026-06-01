'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  MapPin, Calendar, Flame, Link2, Globe,
  Star, ExternalLink, Trophy, Award, Zap, Crown, Target, Sparkles, Pencil,
} from 'lucide-react'
import CopyProfileButton from '@/components/shared/CopyProfileButton'

// three.js can't render on the server — load the lanyard client-only.
// The fallback is dark (not white) so a reload never flashes a white panel.
const Lanyard = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
})

function Github({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}
function Linkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export interface ShippedItem {
  id: string
  title: string
  budget: number
  tags: string[]
  rating: number | null
  prUrl: string | null
  date: string
}

export interface AchievementItem {
  id: string
  label: string
  desc: string
  unlocked: boolean
  icon: 'first' | 'streak' | 'boss' | 'legend' | 'loot' | 'untouchable' | 'sprint' | 'night'
}

export interface ProfileData {
  username: string
  name: string
  headline: string | null
  bio: string | null
  location: string | null
  avatarUrl: string | null
  level: number
  levelTitle: string
  xp: number
  xpProgress: number
  xpRemaining: number
  nextLevel: number | null
  currentStreak: number
  joinedAt: string
  githubUrl: string | null
  linkedinUrl: string | null
  websiteUrl: string | null
  stats: { shipped: number; avgRating: number | null; completionRate: number | null }
  shippedWork: ShippedItem[]
  achievements: AchievementItem[]
  heatmap: { date: string; count: number }[]
}

const ACH_ICON = {
  first: Zap, streak: Flame, boss: Target, legend: Crown,
  loot: Trophy, untouchable: Award, sprint: Zap, night: Sparkles,
} as const

const tile = 'rounded-2xl border border-white/[0.06] bg-[#0c0c0f]/60 backdrop-blur-xl'

export default function PublicProfileView({
  data,
  isOwnProfile = false,
  contained = false,
}: {
  data: ProfileData
  isOwnProfile?: boolean
  /** When true: card column is pinned full-height and only the bento scrolls. */
  contained?: boolean
}) {
  const joined = new Date(data.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })

  const cardCol = (
    <div className="relative h-[470px] lg:h-full rounded-2xl overflow-hidden bg-[#0b0a0d]/40 border border-white/[0.05]">
      <Lanyard card={{ name: data.name, username: data.username, level: data.level, title: data.levelTitle, headline: data.headline, avatarUrl: data.avatarUrl }} />
    </div>
  )

  const bento = (
    <>
      {/* Identity bento */}
      <div className={`${tile} p-6`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight truncate">{data.name}</h1>
            <p className="text-sm text-white/40 font-mono mt-0.5">@{data.username}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CopyProfileButton username={data.username} />
            {isOwnProfile && (
              <Link href="/profile" className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-bold text-white/80 hover:text-white">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Link>
            )}
          </div>
        </div>

        {data.headline && <p className="text-[15px] text-white/75 mt-3 leading-snug">{data.headline}</p>}
        {data.bio && <p className="text-[13px] text-white/45 mt-2 leading-relaxed">{data.bio}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="col-span-2 rounded-xl border border-accent/20 bg-accent/[0.04] p-3.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#ff8a00] font-bold text-xs"><Award className="w-3.5 h-3.5" /> LVL {data.level}</span>
              <span className="text-[10px] font-mono text-white/40">{data.nextLevel ? `${data.xpRemaining} XP →` : 'MAX'}</span>
            </div>
            <p className="text-[13px] font-bold text-white mt-1">{data.levelTitle}</p>
            <div className="relative w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-accent to-[#ff9f43] rounded-full" style={{ width: `${data.xpProgress}%` }} />
            </div>
          </div>
          <MiniStat value={String(data.stats.shipped)} label="Shipped" />
          <MiniStat value={data.stats.avgRating ? `${data.stats.avgRating.toFixed(1)}★` : '—'} label="Rating" />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-[12px] text-white/45 font-mono">
          {data.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-accent" />{data.location}</span>}
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-accent" />Joined {joined}</span>
          {data.currentStreak > 0 && <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-accent" />{data.currentStreak}-day streak</span>}
          {data.stats.completionRate != null && <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-accent" />{data.stats.completionRate}% completion</span>}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {data.githubUrl && <SocialLink href={data.githubUrl} icon={<Github className="w-3.5 h-3.5" />} label={data.githubUrl.replace(/https?:\/\/(www\.)?github\.com\//, '')} />}
          {data.linkedinUrl && <SocialLink href={data.linkedinUrl} icon={<Linkedin className="w-3.5 h-3.5" />} label="LinkedIn" />}
          {data.websiteUrl && <SocialLink href={data.websiteUrl} icon={<Globe className="w-3.5 h-3.5" />} label="Website" />}
          {!data.githubUrl && !data.linkedinUrl && !data.websiteUrl && (
            <span className="text-[12px] text-white/20 font-mono flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" />No links yet</span>
          )}
        </div>
      </div>

      {/* Shipped work */}
      <Section icon={<Trophy className="w-4 h-4 text-[#ff8a00]" />} title="Shipped Work" subtitle="Verified · timestamped · GitHub-linked">
        {data.shippedWork.length === 0 ? (
          <Empty text="No shipped work yet. Approved tasks appear here as verified proof of work." />
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {data.shippedWork.map((t) => (
              <div key={t.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0 group">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white/95 truncate group-hover:text-accent transition-colors">{t.title}</h4>
                    {t.rating != null && (
                      <span className="shrink-0 flex items-center gap-0.5 text-[11px] text-amber-400 font-bold"><Star className="w-3 h-3 fill-amber-400" />{t.rating}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {t.tags.slice(0, 5).map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 bg-white/[0.02] border border-white/[0.06] text-[10px] text-white/40 rounded font-semibold">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm font-black text-accent font-mono">₹{t.budget.toLocaleString()}</span>
                  {t.prUrl ? (
                    <a href={t.prUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-accent/40 hover:text-accent text-white/70 text-xs font-bold transition-colors">
                      <Github className="w-3.5 h-3.5" /> PR <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-white/20 font-mono">{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Achievements */}
      <Section icon={<Award className="w-4 h-4 text-[#ff8a00]" />} title="Achievements" subtitle={`${data.achievements.filter(a => a.unlocked).length} / ${data.achievements.length} unlocked`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.achievements.map((a) => {
            const Icon = ACH_ICON[a.icon]
            return (
              <div key={a.id} className={`rounded-xl border p-3.5 flex items-start gap-3 transition-colors ${a.unlocked ? 'border-accent/25 bg-accent/[0.04]' : 'border-white/[0.05] bg-white/[0.01] opacity-50'}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${a.unlocked ? 'bg-accent/15 text-accent' : 'bg-white/[0.03] text-white/30'}`}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${a.unlocked ? 'text-white' : 'text-white/40'}`}>{a.label}</p>
                  <p className="text-[10px] text-white/35 leading-tight mt-0.5">{a.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Heatmap */}
      <Section icon={<Sparkles className="w-4 h-4 text-[#ff8a00]" />} title="Contribution Activity" subtitle="Shipped tasks · last 26 weeks">
        <Heatmap data={data.heatmap} />
      </Section>
    </>
  )

  if (contained) {
    // Dashboard: card pinned full-height on the left, only the bento scrolls.
    return (
      <div className="flex flex-col lg:flex-row gap-5 h-full min-h-0">
        <div className="lg:w-[440px] lg:shrink-0 lg:h-full">{cardCol}</div>
        <div className="flex-grow min-w-0 lg:h-full lg:overflow-y-auto space-y-4 pb-6 pr-1">{bento}</div>
      </div>
    )
  }

  // Public page: the card is pinned (sticky) just below the navbar and stays put
  // while the bento on the right scrolls. Once the (taller) bento is fully
  // scrolled, the row ends and the card scrolls away with it, revealing the footer.
  return (
    <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-5 items-start">
      <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)]">{cardCol}</div>
      <div className="space-y-4 min-w-0">{bento}</div>
    </div>
  )
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-3 flex flex-col justify-center text-center">
      <div className="text-lg font-black text-white font-mono tabular-nums leading-none">{value}</div>
      <div className="text-[10px] text-white/35 uppercase tracking-wider font-mono mt-1">{label}</div>
    </div>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-accent/40 hover:text-accent text-white/70 text-xs font-semibold transition-colors max-w-[200px]">
      {icon}<span className="truncate">{label}</span>
    </a>
  )
}

function Section({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className={`${tile} p-6 text-left`}>
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h2 className="text-sm font-black tracking-wider font-mono text-white flex items-center gap-2 uppercase">{icon}{title}</h2>
        {subtitle && <span className="text-[11px] text-white/30 font-mono text-right">{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="text-[13px] text-white/30 py-6 text-center">{text}</p>
}

function Heatmap({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  const level = (c: number) => (c === 0 ? 0 : Math.min(4, Math.ceil((c / max) * 4)))
  const colors = ['bg-white/[0.04]', 'bg-accent/25', 'bg-accent/45', 'bg-accent/70', 'bg-accent']
  const weeks: { date: string; count: number }[][] = []
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7))

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((d) => (
              <div key={d.date} title={`${d.count} shipped · ${d.date}`} className={`w-3 h-3 rounded-[3px] ${colors[level(d.count)]}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-white/30 font-mono">
        <span>Less</span>
        {colors.map((c, i) => <div key={i} className={`w-3 h-3 rounded-[3px] ${c}`} />)}
        <span>More</span>
      </div>
    </div>
  )
}
