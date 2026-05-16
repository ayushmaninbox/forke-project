import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { processLoginStreak } from '@/lib/actions/auth-actions'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: 'jwt' },
  trustHost: true,
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
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.id) return false

      // Check if user is banned
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      })

      if (dbUser?.isBanned) {
        return false // Block sign-in
      }

      try {
        await processLoginStreak(user.id)
      } catch (error) {
        console.error('Error processing login streak:', error)
      }
      return true
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

        try {
          const cookieStore = await cookies()
          const preferredRole = cookieStore.get('forke_role')?.value as 'developer' | 'client' | undefined

          // ONLY set role if the user doesn't have one or if they aren't already a developer
          // This prevents a Developer from being accidentally "converted" to a Client
          if (preferredRole && user.role !== 'developer') {
            token.role = preferredRole
            await db.update(users).set({ role: preferredRole }).where(eq(users.id, user.id!))
          } else {
            token.role = user.role
          }
        } catch (error) {
          console.error('Error syncing role in JWT callback:', error)
        }
      }

      // Handle session updates (e.g. after approval)
      if (trigger === 'update' && session) {
        return { ...token, ...session }
      }

      // Fetch fresh data ONLY if we are not in the edge runtime (middleware)
      if (process.env.NEXT_RUNTIME !== 'edge' && token.id) {
        console.log(`[AUTH] Checking DB for user: ${token.id} (Runtime: ${process.env.NEXT_RUNTIME})`)
        try {
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, token.id as string),
          })

          if (dbUser) {
            token.isApproved = dbUser.isApproved
            token.isBanned = dbUser.isBanned
            token.xp = dbUser.xp
            token.level = dbUser.level
            token.currentStreak = dbUser.currentStreak
            
            // If user exists in DB, use their actual DB role
            token.role = dbUser.role
          }
        } catch (error) {
          console.error('Error fetching fresh user data in JWT:', error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'developer' | 'client'
        session.user.level = token.level as number
        session.user.xp = token.xp as number
        session.user.currentStreak = token.currentStreak as number
        session.user.isApproved = token.isApproved as boolean
        session.user.isBanned = token.isBanned as boolean
      }
      return session
    },
  },
  // Removed events.signIn as it's now handled more reliably in the jwt callback
})
