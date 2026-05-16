import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens, githubProfiles } from '@/lib/db/schema'
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
  pages: {
    error: '/auth-error',
  },
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
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email/Username and password required')
        }
        
        const identifier = credentials.email as string
        
        // Find user by email or username
        let dbUser = await db.query.users.findFirst({
          where: eq(users.email, identifier)
        })

        if (!dbUser) {
          dbUser = await db.query.users.findFirst({
            where: eq(users.username, identifier)
          })
        }

        if (!dbUser || !dbUser.passwordHash) {
          throw new Error('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          dbUser.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        return dbUser
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) return false

      try {
        // Check if user is banned and determine if new user
        // We query by email because during sign-up, user.id might be the provider's ID (not a UUID)
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        })

        if (dbUser) {
          if (dbUser.isBanned) {
            const cookieStore = await cookies()
            cookieStore.set('forke_auth_error', '1', { maxAge: 60, path: '/' })
            return '/auth-error?error=AccessDenied' // Block sign-in and redirect to specific error
          }
          
          // Prevent GitHub identity collision
          if (account?.provider === 'github' && dbUser.githubUrl && profile?.login) {
            const existingLogin = dbUser.githubUrl.split('/').pop()?.toLowerCase()
            const newLogin = (profile.login as string).toLowerCase()
            if (existingLogin && existingLogin !== newLogin) {
              console.error(`GitHub Conflict: existing (${existingLogin}) vs new (${newLogin})`)
              const cookieStore = await cookies()
              cookieStore.set('forke_auth_error', '1', { maxAge: 60, path: '/' })
              return '/auth-error?error=GitHubIdentityMismatch'
            }
          }
        }
      } catch (error: any) {
        console.error('Error in signIn db checks:', error)
      }

      try {
        if (user.id && user.id.includes('-')) {
          await processLoginStreak(user.id)
        }
      } catch (error) {
        console.error('Error processing login streak:', error)
      }
      return true
    },
    async jwt({ token, user, account, profile, trigger, session }) {
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

      // Handle session updates (e.g. after approval)
      if (trigger === 'update' && session) {
        return { ...token, ...session }
      }

      // Initial Sign In: Fetch extensive GitHub Data since the user now exists in the DB
      if (account?.provider === 'github' && account.access_token && profile?.login && token.id) {
         try {
           const headers = { Authorization: `Bearer ${account.access_token}` }
           
           // Fetch user data
           const userRes = await fetch(`https://api.github.com/user`, { headers })
           const githubData = userRes.ok ? await userRes.json() : null
           
           // Fetch repos (up to 100)
           const reposRes = await fetch(`https://api.github.com/user/repos?per_page=100&sort=updated`, { headers })
           const reposData = reposRes.ok ? await reposRes.json() : null

           if (githubData && reposData) {
             const githubUrl = githubData.html_url as string || `https://github.com/${profile.login}`
             
             // Update the newly created user in the DB
             await db.update(users).set({ 
               githubUrl: githubUrl,
               githubStats: {
                 followers: githubData.followers,
                 following: githubData.following,
                 public_repos: githubData.public_repos,
                 total_private_repos: githubData.total_private_repos,
                 public_gists: githubData.public_gists,
                 private_gists: githubData.private_gists,
                 created_at: githubData.created_at,
                 updated_at: githubData.updated_at
               }
             }).where(eq(users.id, token.id as string))

             // Make sure the token has the url so we don't trigger the onboarding redirect this session
             token.githubUrl = githubUrl

             // Upsert into githubProfiles
             const existingProfile = await db.query.githubProfiles.findFirst({
               where: eq(githubProfiles.userId, token.id as string)
             })

             // Compute primary language statistics from repos
             const languageCounts: Record<string, number> = {}
             if (Array.isArray(reposData)) {
               reposData.forEach((repo: any) => {
                 if (repo.language) {
                   languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
                 }
               })
             }
             // Sort by frequency
             const languages = Object.entries(languageCounts)
               .sort((a, b) => b[1] - a[1])
               .reduce((acc, [lang, count]) => ({ ...acc, [lang]: count }), {})

             const profileData = {
               userId: token.id as string,
               githubId: githubData.id.toString(),
               login: githubData.login,
               avatarUrl: githubData.avatar_url,
               profileUrl: githubUrl,
               rawProfile: githubData,
               repos: reposData,
               languages: languages,
               updatedAt: new Date(),
             }

             if (existingProfile) {
               await db.update(githubProfiles).set(profileData).where(eq(githubProfiles.id, existingProfile.id))
             } else {
               await db.insert(githubProfiles).values({
                 ...profileData,
                 createdAt: new Date(),
               })
             }
           }
         } catch (e) {
           console.error('Error fetching extensive github stats in jwt callback:', e)
         }
      }

      // Fetch fresh data ONLY if we are not in the edge runtime (middleware)
      if (process.env.NEXT_RUNTIME !== 'edge' && token.id) {
        console.log(`[AUTH] Checking DB for user: ${token.id} (Runtime: ${process.env.NEXT_RUNTIME})`)
        try {
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, token.id as string),
          })

          if (dbUser) {
            // Correct role if this is a brand new user (created within last 15 seconds)
            const isNewUser = dbUser.createdAt.getTime() > Date.now() - 15000;
            if (isNewUser) {
              try {
                const cookieStore = await cookies()
                const preferredRole = cookieStore.get('forke_role')?.value as 'developer' | 'owner' | undefined
                if (preferredRole && preferredRole !== dbUser.role) {
                  await db.update(users).set({ role: preferredRole }).where(eq(users.id, dbUser.id));
                  dbUser.role = preferredRole; // Instantly apply so token gets it
                }
              } catch (e) {
                console.error('Error syncing role in jwt callback:', e)
              }
            }

            token.isApproved = dbUser.isApproved
            token.isBanned = dbUser.isBanned
            token.xp = dbUser.xp
            token.level = dbUser.level
            token.currentStreak = dbUser.currentStreak
            token.githubUrl = dbUser.githubUrl
            token.username = dbUser.username
            
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
  },
  // Removed events.signIn as it's now handled more reliably in the jwt callback
})
