'use server'

import { auth, signIn, signOut } from '@/auth'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { users, developers } from '@/lib/db/schema'
import { eq, ilike, or } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function signInWithGoogle(role?: 'developer' | 'owner', redirectTo?: string) {
  const cookieStore = await cookies()
  if (role) {
    cookieStore.set('forke_role', role, {
      path: '/',
      maxAge: 3600, // 1 hour
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    })
  }
  
  await signIn('google', { redirectTo: redirectTo || '/dashboard' })
}

export async function signInWithGitHub(role?: 'developer' | 'owner', redirectTo?: string) {
  const cookieStore = await cookies()
  if (role) {
    cookieStore.set('forke_role', role, {
      path: '/',
      maxAge: 3600,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    })
  }
  
  await signIn('github', { redirectTo: redirectTo || '/dashboard' })
}

export async function signOutAction() {
  await signOut()
}

export async function registerDeveloperWithCredentials(formData: any) {
  const { firstName, lastName, email, password, confirmPassword, githubUrl, username } = formData

  if (!firstName || !lastName || !email || !password || !confirmPassword || !username) {
    return { success: false, error: 'All core fields including username are required.' }
  }

  // Username validation: max 30 chars, case sensitive, only "-" and "_" allowed besides alphanumeric
  if (username.length > 30) {
    return { success: false, error: 'Username must be 30 characters or less.' }
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { success: false, error: 'Username can only contain letters, numbers, hyphens (-), and underscores (_).' }
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' }
  }

  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' }
  }

  try {
    const existingUserByEmail = await db.query.users.findFirst({
      where: eq(users.email, email)
    })

    if (existingUserByEmail) {
      return { success: false, error: 'A user with this email already exists.' }
    }

    const existingUserByUsername = await db.query.users.findFirst({
      where: eq(users.username, username)
    })

    if (existingUserByUsername) {
      return { success: false, error: 'This username is already taken. Please choose another.' }
    }

    let finalGithubUrl = null
    let profileData: any = null

    // Validate GitHub Profile if provided
    if (githubUrl) {
      try {
        let username = ''
        if (githubUrl.includes('github.com/')) {
          username = githubUrl.split('github.com/')[1].split('/')[0]
        } else {
          // Fallback if they just typed their username
          username = githubUrl.trim()
        }

        if (username) {
          const githubRes = await fetch(`https://api.github.com/users/${username}`)
          if (!githubRes.ok) {
            return { success: false, error: 'This GitHub profile does not exist or is invalid. Please double-check the link.' }
          }

          // Keep githubRes data for later insertion into githubProfiles
          profileData = await githubRes.json()
          const canonicalUsername = profileData.login
          finalGithubUrl = `https://github.com/${canonicalUsername}`

          // Check if this GitHub profile is already claimed by another user
          const existingProfile = await db.query.developers.findFirst({
            where: ilike(developers.username, canonicalUsername)
          })

          const existingUserWithGithub = await db.query.users.findFirst({
            where: or(
              ilike(users.githubUrl, `%github.com/${canonicalUsername}`),
              ilike(users.githubUrl, `%github.com/${canonicalUsername}/`)
            )
          })

          if (existingProfile || existingUserWithGithub) {
            return { success: false, error: 'This GitHub profile is already linked to another account on Forke.' }
          }
        }
      } catch (error) {
        return { success: false, error: 'Failed to validate GitHub profile. Please ensure it is a valid URL.' }
      }
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const fullName = `${firstName} ${lastName}`

    const [newUser] = await db.insert(users).values({
      name: fullName,
      email: email,
      username: username,
      passwordHash: passwordHash,
      role: 'developer',
      githubUrl: finalGithubUrl,
      image: profileData ? profileData.avatar_url : null,
      isApproved: true, // Developers are instantly approved
      githubStats: profileData ? {
        followers: profileData.followers,
        following: profileData.following,
        public_repos: profileData.public_repos,
        total_private_repos: profileData.total_private_repos,
        public_gists: profileData.public_gists,
        private_gists: profileData.private_gists,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at
      } : null
    }).returning({ id: users.id })

    // Extract detailed GitHub data if profile was provided
    if (profileData && newUser) {
      try {
        const reposRes = await fetch(`https://api.github.com/users/${profileData.login}/repos?per_page=100&sort=updated`)
        const reposData = reposRes.ok ? await reposRes.json() : null

        const languageCounts: Record<string, number> = {}
        if (Array.isArray(reposData)) {
          reposData.forEach((repo: any) => {
            if (repo.language) {
              languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
            }
          })
        }
        
        const languages = Object.entries(languageCounts)
          .sort((a, b) => b[1] - a[1])
          .reduce((acc, [lang, count]) => ({ ...acc, [lang]: count }), {})

        await db.insert(developers).values({
          userId: newUser.id,
          githubId: profileData.id.toString(),
          username: profileData.login,
          accessToken: '',
          avatarUrl: profileData.avatar_url,
          profileUrl: finalGithubUrl,
          rawProfile: profileData,
          repos: reposData,
          languages: languages,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      } catch (e) {
        console.error('Failed to save extensive GitHub stats during credentials signup', e)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error registering developer:', error)
    return { success: false, error: 'Failed to create account. Please try again later.' }
  }
}

export async function completeOnboarding(formData: any) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized.' }
  }

  const { username, githubUrl } = formData

  if (!username) {
    return { success: false, error: 'Username is required.' }
  }

  if (username.length > 30) {
    return { success: false, error: 'Username must be 30 characters or less.' }
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { success: false, error: 'Username can only contain letters, numbers, hyphens (-), and underscores (_).' }
  }

  try {
    const existingUserByUsername = await db.query.users.findFirst({
      where: eq(users.username, username)
    })

    if (existingUserByUsername && existingUserByUsername.id !== session.user.id) {
      return { success: false, error: 'This username is already taken. Please choose another.' }
    }

    let finalGithubUrl = session.user.githubUrl
    let profileData: any = null

    // If the user doesn't have a githubUrl but provided one now
    if (!session.user.githubUrl && githubUrl) {
      try {
        let ghUsername = ''
        if (githubUrl.includes('github.com/')) {
          ghUsername = githubUrl.split('github.com/')[1].split('/')[0]
        } else {
          ghUsername = githubUrl.trim()
        }

        if (ghUsername) {
          const githubRes = await fetch(`https://api.github.com/users/${ghUsername}`)
          if (!githubRes.ok) {
            return { success: false, error: 'This GitHub profile does not exist or is invalid.' }
          }

          profileData = await githubRes.json()
          const canonicalUsername = profileData.login
          finalGithubUrl = `https://github.com/${canonicalUsername}`

          // Check if claimed
          const existingProfile = await db.query.developers.findFirst({
            where: ilike(developers.username, canonicalUsername)
          })

          const existingUserWithGithub = await db.query.users.findFirst({
            where: or(
              ilike(users.githubUrl, `%github.com/${canonicalUsername}`),
              ilike(users.githubUrl, `%github.com/${canonicalUsername}/`)
            )
          })

          if ((existingProfile && existingProfile.userId !== session.user.id) || 
              (existingUserWithGithub && existingUserWithGithub.id !== session.user.id)) {
            return { success: false, error: 'This GitHub profile is already linked to another account.' }
          }
        }
      } catch (error) {
        return { success: false, error: 'Failed to validate GitHub profile.' }
      }
    }

    await db.update(users).set({
      username: username,
      githubUrl: finalGithubUrl,
      ...(profileData && {
        image: profileData.avatar_url,
        githubStats: {
          followers: profileData.followers,
          following: profileData.following,
          public_repos: profileData.public_repos,
          total_private_repos: profileData.total_private_repos,
          public_gists: profileData.public_gists,
          private_gists: profileData.private_gists,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        }
      })
    }).where(eq(users.id, session.user.id))

    // Handle github profile data upsert
    if (profileData) {
      try {
        const reposRes = await fetch(`https://api.github.com/users/${profileData.login}/repos?per_page=100&sort=updated`)
        const reposData = reposRes.ok ? await reposRes.json() : null

        const languageCounts: Record<string, number> = {}
        if (Array.isArray(reposData)) {
          reposData.forEach((repo: any) => {
            if (repo.language) {
              languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
            }
          })
        }
        
        const languages = Object.entries(languageCounts)
          .sort((a, b) => b[1] - a[1])
          .reduce((acc, [lang, count]) => ({ ...acc, [lang]: count }), {})

        const profilePayload = {
          userId: session.user.id,
          githubId: profileData.id.toString(),
          username: profileData.login,
          accessToken: '',
          avatarUrl: profileData.avatar_url,
          profileUrl: finalGithubUrl,
          rawProfile: profileData,
          repos: reposData,
          languages: languages,
          updatedAt: new Date(),
        }

        const existingProfile = await db.query.developers.findFirst({
          where: eq(developers.userId, session.user.id)
        })

        if (existingProfile) {
          await db.update(developers).set(profilePayload).where(eq(developers.id, existingProfile.id))
        } else {
          await db.insert(developers).values({
            ...profilePayload,
            createdAt: new Date(),
          })
        }
      } catch (err) {
        console.error('Failed to sync deep github stats during onboarding', err)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error during onboarding:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
