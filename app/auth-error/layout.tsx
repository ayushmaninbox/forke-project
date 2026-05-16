import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication Error',
  description: 'There was a problem with your authentication. Please submit an enquiry to our support team.',
  robots: {
    index: false,
    follow: false,
  }
}

export default function AuthErrorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
