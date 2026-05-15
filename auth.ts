import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
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
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.id) {
        try {
          await processLoginStreak(user.id)
        } catch (error) {
          console.error('Error processing login streak:', error)
          // Don't block sign-in if streak processing fails
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        // Initial sign in
        let role = user.role
        const level = user.level
        const xp = user.xp
        const currentStreak = user.currentStreak

        try {
          // Read the forke_role cookie to ensure the role is correct on the very first sign-in
          const cookieStore = await cookies()
          const preferredRole = cookieStore.get('forke_role')?.value as 'developer' | 'client' | undefined

          if (preferredRole && preferredRole !== role) {
            role = preferredRole
            // Sync to DB immediately so the token matches the DB state
            await db
              .update(users)
              .set({ role: preferredRole })
              .where(eq(users.id, user.id!))
          }
        } catch (error) {
          console.error('Error syncing role in JWT callback:', error)
        }

        token.id = user.id
        token.role = role
        token.level = level
        token.xp = xp
        token.currentStreak = currentStreak
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
      }
      return session
    },
  },
  // Removed events.signIn as it's now handled more reliably in the jwt callback
})
