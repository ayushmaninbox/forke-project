import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isWaitlistEnabled } from '@/lib/db/settings'

// The waitlist only exists while the lock is on. Once an admin turns the
// waitlist off, the site is fully open and this route should no longer resolve.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Join the Waitlist',
  description:
    'Forke is rolling out access in waves. Join the waitlist to be among the first developers and teams to ship real work and get paid on the platform.',
  keywords: ['forke waitlist', 'early access', 'developer marketplace beta'],
  alternates: { canonical: '/waitlist' },
  openGraph: {
    title: 'Join the Waitlist | Forke',
    description: 'Be among the first to ship real work and get paid on Forke.',
    url: 'https://www.forke.space/waitlist',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the Waitlist | Forke',
    description: 'Be among the first to ship real work and get paid on Forke.',
  },
}

export default async function WaitlistLayout({ children }: { children: React.ReactNode }) {
  // Lock off → no waitlist. Render the standard not-found page at this URL.
  if (!(await isWaitlistEnabled())) {
    notFound()
  }
  return <>{children}</>
}
