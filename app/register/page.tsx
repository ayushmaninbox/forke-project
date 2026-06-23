import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import RegisterContent from '@/components/auth/RegisterContent'
import { isWaitlistEnabled } from '@/lib/db/settings'

// While the waitlist lock is on, sign-up is closed — this route 404s. Once the
// lock is lifted (site fully open), registration works normally.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Join the Movement',
  description: 'Create your Forke account today. Start your journey as a builder, ship real work, and earn rewards in the developer marketplace.',
  alternates: { canonical: '/register' },
  openGraph: {
    title: 'Join the Movement | Forke',
    description: 'Start your journey as a builder and get paid for your work.',
    url: 'https://www.forke.space/register',
  },
}

export default async function RegisterPage() {
  if (await isWaitlistEnabled()) {
    notFound()
  }
  return <RegisterContent />
}
