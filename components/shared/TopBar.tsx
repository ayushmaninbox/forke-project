import { auth } from '@/auth'
import Image from 'next/image'
import { Bell } from 'lucide-react'
import MobileMenuTrigger from '../dashboard/MobileMenuTrigger'

interface TopBarProps {
  title: string
}

export default async function TopBar({ title }: TopBarProps) {
  const session = await auth()
  const user = session?.user

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
    : '?'

  return (
    <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <MobileMenuTrigger />
        <h1 className="font-serif text-xl md:text-2xl text-[var(--color-text-primary)] tracking-tight">{title}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors relative group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--color-border)] bg-accent/10 flex items-center justify-center">
          {user?.image ? (
            <Image 
              src={user.image} 
              alt={user.name || 'User'} 
              fill 
              className="object-cover"
            />
          ) : (
            <span className="text-accent font-bold text-sm uppercase">{initials}</span>
          )}
        </div>
      </div>
    </header>
  )
}
