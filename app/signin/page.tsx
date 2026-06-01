import { Metadata } from 'next'
import SignInContent from '@/components/auth/SignInContent'

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

export default function SignInPage() {
  return <SignInContent />
}
