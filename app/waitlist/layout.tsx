import { Metadata } from 'next'

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

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
