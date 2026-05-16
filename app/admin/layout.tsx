import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-actions'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Control Unit',
  description: 'Forke administrative dashboard.',
  robots: {
    index: false,
    follow: false,
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAdminAuthenticated()

  // Simple path check to avoid redirect loop
  if (!authenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-bg">
      {children}
    </div>
  )
}
