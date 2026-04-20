import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn() {
      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // @ts-expect-error - role exists in our database schema
        session.user.role = user.role
      }
      return session
    },
  },
})
