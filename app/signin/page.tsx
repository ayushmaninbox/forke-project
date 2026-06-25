import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import SignInContent from '@/components/auth/SignInContent'
import { isWaitlistEnabled } from '@/lib/db/settings'

// While the waitlist lock is on, sign-in is closed — this route 404s. EXCEPT for
// visitors who unlocked the site via /checkout (site_access cookie), so the bypass
// password actually grants access to sign in. Once the lock is lifted, it's open to all.
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
  const hasSiteAccess = (await cookies()).get('site_access')?.value === 'granted'
  if (await isWaitlistEnabled() && !hasSiteAccess) {
    notFound()
  }
  return <SignInContent />
}
