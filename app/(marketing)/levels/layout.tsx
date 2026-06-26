import { Metadata } from 'next'
import { buildOpenGraph, buildTwitter } from '@/lib/utils/og'

export const metadata: Metadata = {
  title: 'Levels & Progression',
  description:
    'Climb 25 milestones across 5 prestige tiers on Forke. Earn XP by shipping high-quality code, keeping streaks, and delivering early to unlock badges, themes, and premium projects.',
  keywords: ['forke levels', 'developer xp', 'progression system', 'coding tiers', 'developer ranks'],
  alternates: { canonical: '/levels' },
  openGraph: buildOpenGraph({
    title: 'Levels & Progression | Forke',
    description: 'Earn XP, climb 25 milestones across 5 prestige tiers, and unlock exclusive developer rewards.',
    url: 'https://www.forke.space/levels',
  }),
  twitter: buildTwitter({
    title: 'Levels & Progression | Forke',
    description: 'Earn XP, climb 25 milestones across 5 prestige tiers, and unlock exclusive developer rewards.',
  }),
}

export default function LevelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
