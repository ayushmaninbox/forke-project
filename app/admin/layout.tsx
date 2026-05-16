import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-actions'

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
