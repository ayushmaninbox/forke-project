import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: 'read:user user:email repo',
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: {
    error: '/auth-error',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as 'developer' | 'owner'
        session.user.level = token.level as number
        session.user.xp = token.xp as number
        session.user.currentStreak = token.currentStreak as number
        session.user.isApproved = token.isApproved as boolean
        session.user.isBanned = token.isBanned as boolean
        session.user.githubUrl = token.githubUrl as string | null
        session.user.username = token.username as string | null
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.level = user.level
        token.xp = user.xp
        token.currentStreak = user.currentStreak
        token.isApproved = user.isApproved
        token.isBanned = user.isBanned
        token.githubUrl = user.githubUrl
        token.username = user.username
      }
      if (trigger === 'update' && session) {
        return { ...token, ...session }
      }
      return token
    }
  }
} satisfies NextAuthConfig
