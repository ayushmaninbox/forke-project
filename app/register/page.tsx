import { Metadata } from 'next'
import RegisterContent from '@/components/auth/RegisterContent'

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

export default function RegisterPage() {
  return <RegisterContent />
}
