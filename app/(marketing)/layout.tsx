import { AuthProvider } from '@/components/auth/AuthContext'
import SignInModal from '@/components/auth/SignInModal'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
      <SignInModal />
    </AuthProvider>
  )
}
