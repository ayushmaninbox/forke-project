import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/shared/Sidebar'
import { DashboardProvider } from '@/components/dashboard/DashboardContext'
import { getLevelFromXp } from '@/lib/utils/tasks'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/')
  }

  const user = session.user as { name?: string | null; image?: string | null; xp?: number }
  const userLevel = getLevelFromXp(user.xp || 0)

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-[var(--color-bg-surface)] overflow-hidden">
        <Sidebar user={{ name: user.name, image: user.image, level: userLevel }} />
        <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </DashboardProvider>
  )
}
