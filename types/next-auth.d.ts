import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'developer' | 'owner'
      xp: number
      level: number
      currentStreak: number
      isApproved: boolean
      isBanned: boolean
      githubUrl?: string | null
      username?: string | null
      isGithubConnected?: boolean
    } & DefaultSession['user']
  }

  interface User {
    role?: 'developer' | 'owner'
    xp?: number
    level?: number
    currentStreak?: number
    isApproved?: boolean
    isBanned?: boolean
    githubUrl?: string | null
    username?: string | null
    isGithubConnected?: boolean
  }
}
