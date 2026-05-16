import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'developer' | 'client'
      xp: number
      level: number
      currentStreak: number
      isApproved: boolean
      isBanned: boolean
    } & DefaultSession['user']
  }

  interface User {
    role?: 'developer' | 'client'
    xp?: number
    level?: number
    currentStreak?: number
    isApproved?: boolean
    isBanned?: boolean
  }
}
