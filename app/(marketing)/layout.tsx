import { AuthProvider } from '@/components/auth/AuthContext'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
