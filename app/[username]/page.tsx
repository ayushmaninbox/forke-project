import { db } from '@/lib/db'
import { users, owners, tasks, submissions } from '@/lib/db/schema'
import { eq, desc, sql, and } from 'drizzle-orm'
import {
  getLevelFromXp, getLevelTitle, getLevelProgress, getXpForNextLevel,
} from '@/lib/utils/xp'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { resolveAvatarUrl } from '@/lib/utils/avatar'
import { ensureProfileColumns } from '@/lib/actions/profile-actions'
import PublicProfileView, { ProfileData, ShippedItem, AchievementItem } from '@/components/profile/PublicProfileView'

const RESERVED_KEYWORDS = [
  'admin', 'api', 'checkout', 'privacy', 'register', 'signin', 'terms', 'waitlist',
  'auth-error', 'profile', 'dashboard', 'tasks', 'submissions', 'earnings',
  'messages', 'settings', 'support', 'developers', 'onboarding', 'post-task', 'notifications',
]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params
  if (RESERVED_KEYWORDS.includes(username.toLowerCase())) return {}

  const dbUser = await db.query.users.findFirst({ where: eq(users.username, username) })
  if (!dbUser) return {}

  const level = getLevelFromXp(dbUser.xp || 0)
  const title = `${dbUser.name} (@${dbUser.username})`
  const description = `${dbUser.bio || dbUser.headline || 'Building real, verified work on Forke.'} · Level ${level} ${getLevelTitle(level)}.`
  const avatar = resolveAvatarUrl(dbUser.image) || 'https://www.forke.space/icon.png'

  return {
    title,
    description,
    alternates: { canonical: `/${dbUser.username}` },
    openGraph: { title, description, images: [{ url: avatar, width: 800, height: 800, alt: dbUser.name }], type: 'profile', username: dbUser.username || undefined },
    twitter: { card: 'summary_large_image', title, description, images: [avatar] },
  }
}

function buildHeatmap(dates: Date[]): { date: string; count: number }[] {
  const days = 182 // 26 weeks
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const counts = new Map<string, number>()
  for (const d of dates) {
    const key = new Date(d).toISOString().slice(0, 10)
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  const out: { date: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    out.push({ date: key, count: counts.get(key) || 0 })
  }
  return out
}

function buildAchievements(opts: { shipped: number; level: number; streak: number; earned: number }): AchievementItem[] {
  const { shipped, level, streak, earned } = opts
  return [
    { id: 'first', label: 'First Blood', desc: 'Shipped your first task', unlocked: shipped >= 1, icon: 'first' },
    { id: 'sprint', label: 'Sprinter', desc: 'Shipped 5+ tasks', unlocked: shipped >= 5, icon: 'sprint' },
    { id: 'untouchable', label: 'Untouchable', desc: '20+ approved ships', unlocked: shipped >= 20, icon: 'untouchable' },
    { id: 'streak', label: 'Streak God', desc: '30-day login streak', unlocked: streak >= 30, icon: 'streak' },
    { id: 'loot', label: 'Loot Goblin', desc: 'Earned ₹10,000+', unlocked: earned >= 10000, icon: 'loot' },
    { id: 'boss', label: 'Boss Mode', desc: 'Reached Level 15', unlocked: level >= 15, icon: 'boss' },
    { id: 'legend', label: 'Forke Legend', desc: 'Reached Level 25', unlocked: level >= 25, icon: 'legend' },
    { id: 'night', label: 'Stack Explorer', desc: 'Reached Level 5', unlocked: level >= 5, icon: 'night' },
  ]
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  if (RESERVED_KEYWORDS.includes(username.toLowerCase())) notFound()

  await ensureProfileColumns()

  const dbUser = await db.query.users.findFirst({ where: eq(users.username, username) })
  if (!dbUser) notFound()

  const session = await auth()
  const isOwnProfile = !!session?.user && session.user.id === dbUser.id
  const isOwner = dbUser.role === 'owner'

  // ----- XP / level -----
  const xp = dbUser.xp || 0
  const level = getLevelFromXp(xp)
  const levelTitle = getLevelTitle(level)
  const xpProgress = getLevelProgress(xp)
  const nextLevelXp = getXpForNextLevel(level)
  const xpRemaining = nextLevelXp ? nextLevelXp - xp : 0

  // ----- shipped work + stats -----
  let shippedWork: ShippedItem[] = []
  let shipped = 0
  let avgRating: number | null = null
  let completionRate: number | null = null
  let earned = 0
  let shipDates: Date[] = []

  if (isOwner) {
    const rows = await db
      .select({ id: tasks.id, title: tasks.title, budget: tasks.budget, tags: tasks.skillTags, date: tasks.createdAt })
      .from(tasks)
      .where(and(eq(tasks.clientId, dbUser.id), eq(tasks.status, 'approved')))
      .orderBy(desc(tasks.createdAt))
      .limit(30)
    shippedWork = rows.map((r) => ({ id: r.id, title: r.title, budget: Math.floor((r.budget || 0) / 100), tags: r.tags || [], rating: null, prUrl: null, date: r.date.toISOString() }))
    shipped = rows.length
    shipDates = rows.map((r) => r.date)
    earned = rows.reduce((s, r) => s + Math.floor((r.budget || 0) / 100), 0)
  } else {
    const rows = await db
      .select({
        id: tasks.id, title: tasks.title, budget: tasks.budget, tags: tasks.skillTags,
        rating: submissions.rating, prUrl: submissions.githubLink, date: submissions.createdAt,
      })
      .from(submissions)
      .innerJoin(tasks, eq(submissions.taskId, tasks.id))
      .where(and(eq(submissions.developerId, dbUser.id), eq(submissions.status, 'approved')))
      .orderBy(desc(submissions.createdAt))
      .limit(30)
    shippedWork = rows.map((r) => ({ id: r.id, title: r.title, budget: Math.floor((r.budget || 0) / 100), tags: r.tags || [], rating: r.rating ?? null, prUrl: r.prUrl ?? null, date: r.date.toISOString() }))
    shipped = rows.length
    shipDates = rows.map((r) => r.date)
    earned = rows.reduce((s, r) => s + Math.floor((r.budget || 0) / 100), 0)

    const ratings = rows.map((r) => r.rating).filter((r): r is number => typeof r === 'number')
    avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null

    const totals = await db
      .select({ total: sql<number>`count(*)::int`, approved: sql<number>`count(*) filter (where ${submissions.status} = 'approved')::int` })
      .from(submissions)
      .where(eq(submissions.developerId, dbUser.id))
    const t = totals[0]
    completionRate = t && t.total > 0 ? Math.round((t.approved / t.total) * 100) : null
  }

  let ownerName: string | null = null
  if (isOwner) {
    const od = await db.query.owners.findFirst({ where: eq(owners.id, dbUser.id) })
    ownerName = od?.companyName || null
  }

  const data: ProfileData = {
    username: dbUser.username || username,
    name: ownerName || dbUser.name,
    headline: dbUser.headline ?? null,
    bio: dbUser.bio ?? null,
    location: dbUser.location ?? null,
    avatarUrl: resolveAvatarUrl(dbUser.image),
    level,
    levelTitle,
    xp,
    xpProgress,
    xpRemaining,
    nextLevel: nextLevelXp ? level + 1 : null,
    currentStreak: dbUser.currentStreak || 0,
    joinedAt: dbUser.createdAt.toISOString(),
    githubUrl: dbUser.githubUrl ?? null,
    linkedinUrl: dbUser.linkedinUrl ?? null,
    websiteUrl: dbUser.websiteUrl ?? null,
    stats: { shipped, avgRating, completionRate },
    shippedWork,
    achievements: buildAchievements({ shipped, level, streak: dbUser.currentStreak || 0, earned }),
    heatmap: buildHeatmap(shipDates),
  }

  return (
    <div className="min-h-screen bg-[#060608] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#060608] to-[#060608] text-white font-sans flex flex-col antialiased">
      {/* Public Header */}
      <header className="border-b border-white/5 bg-[#060608]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 select-none group">
            <span className="text-base font-black tracking-widest text-[#ff8a00] font-mono group-hover:text-white transition-colors">FORKE //</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a00] animate-pulse" />
          </Link>
          <div className="flex items-center gap-2">
            {session?.user ? (
              <Link href="/dashboard" className="h-9 px-4 rounded-lg bg-[#ff8a00] hover:bg-[#ff8a00]/90 transition-all text-xs font-black text-[#0a0a0a] flex items-center cursor-pointer">Dashboard</Link>
            ) : (
              <>
                <Link href="/signin" className="h-9 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold text-white/80 hover:text-white flex items-center cursor-pointer">Sign in</Link>
                <Link href="/register" className="h-9 px-4 rounded-lg bg-[#ff8a00] hover:bg-[#ff8a00]/90 transition-all text-xs font-black text-[#0a0a0a] flex items-center cursor-pointer">Join Forke</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-5 py-8 md:py-10">
        <PublicProfileView data={data} isOwnProfile={isOwnProfile} />
      </main>

      <footer className="border-t border-white/5 py-6 bg-[#060608]">
        <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30 font-medium font-mono">
          <div>© {new Date().getFullYear()} Forke Technology Group. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
