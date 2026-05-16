import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Onboarding',
  description: 'Complete your profile setup to start shipping real work and getting paid on Forke.',
  robots: {
    index: false,
    follow: false,
  }
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
