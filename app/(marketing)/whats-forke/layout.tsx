import { Metadata } from 'next'
import { buildOpenGraph, buildTwitter } from '@/lib/utils/og'

export const metadata: Metadata = {
  title: "What's Forke?",
  description:
    'Forke is a gamified micro-task marketplace for developers. Claim verified coding bounties, level up your engineering tier, and cash out rewards instantly. Learn how it works.',
  keywords: ['about forke', 'how forke works', 'coding bounties', 'open source rewards', 'developer marketplace'],
  alternates: { canonical: '/whats-forke' },
  openGraph: buildOpenGraph({
    title: "What's Forke? | Forke",
    description: 'A gamified contribution space where developers claim verified coding tasks, level up, and earn instantly.',
    url: 'https://www.forke.space/whats-forke',
  }),
  twitter: buildTwitter({
    title: "What's Forke? | Forke",
    description: 'A gamified contribution space where developers claim verified coding tasks, level up, and earn instantly.',
  }),
}

export default function WhatsForkeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
