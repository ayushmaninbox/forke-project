import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SignInContent from '@/components/auth/SignInContent'
import { isWaitlistEnabled } from '@/lib/db/settings'

// While the waitlist lock is on, sign-in is closed — this route 404s. Once the
// lock is lifted (site fully open), sign-in works normally.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Log in to your Forke account to access bounties, track your level, and manage your developer earnings.',
  alternates: { canonical: '/signin' },
  openGraph: {
    title: 'Sign In | Forke',
    description: 'Access the developer marketplace and continue your journey.',
    url: 'https://www.forke.space/signin',
  },
}

export default async function SignInPage() {
  if (await isWaitlistEnabled()) {
    notFound()
  }
  return <SignInContent />
}
