import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with the Forke team. Questions about bounties, payouts, the review pipeline, or partnerships — reach us by email or send a message.',
  keywords: ['contact forke', 'forke support', 'forke email', 'get in touch', 'developer marketplace contact'],
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Forke',
    description: 'Questions about bounties, payouts, or partnerships? Reach the Forke team.',
    url: 'https://www.forke.space/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Forke',
    description: 'Questions about bounties, payouts, or partnerships? Reach the Forke team.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
