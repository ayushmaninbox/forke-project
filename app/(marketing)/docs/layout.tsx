import { Metadata } from 'next'

export const metadata: Metadata = {
  // Articles override %s, e.g. "Welcome to Forke - Forke Docs". The docs home
  // sets its own absolute title ("Forke Docs") in app/(marketing)/docs/page.tsx
  // so it isn't wrapped by the root "%s | Forke" template.
  title: {
    default: 'Forke Docs',
    template: '%s - Forke Docs',
  },
  description:
    'The official Forke documentation. Learn how the developer micro-task marketplace works end to end: claim scoped bounties gated by level, skill tier and trust score, ship work as a pull request, pass the automated and AI review pipeline, and get paid instantly to your UPI via Razorpay escrow. Includes guides for developers and founders, the XP and levelling system, GitHub branch workflow, and trust and safety policies.',
  keywords: [
    'forke docs',
    'forke documentation',
    'how forke works',
    'developer micro-task marketplace',
    'coding bounties',
    'bounty workflow',
    'pull request submission',
    'AI code review pipeline',
    'UPI escrow payouts',
    'razorpay escrow',
    'developer XP levels',
    'skill tier gating',
    'trust score',
    'github branch workflow',
    'earn money coding india',
  ],
  alternates: { canonical: '/docs' },
  openGraph: {
    title: 'Forke Docs — How the developer bounty marketplace works',
    description:
      'Everything about claiming bounties, shipping pull requests, passing the AI review pipeline, and getting paid via UPI escrow — for developers and founders alike.',
    url: 'https://www.forke.space/docs',
    siteName: 'Forke',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forke Docs — How the developer bounty marketplace works',
    description:
      'Claim scoped bounties, ship a PR, pass automated + AI review, and get paid instantly via UPI escrow. The complete Forke guide for developers and founders.',
  },
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
