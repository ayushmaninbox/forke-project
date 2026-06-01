'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { users, accounts, githubProfiles } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { createHash } from 'crypto'
import { encryptUrl } from '@/lib/utils/encrypt'
import { revalidatePath } from 'next/cache'

// Runtime migration for the profile fields (mirrors ensureTelemetrySettingsColumns).
export async function ensureProfileColumns() {
  try {
    await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "headline" text;`)
    await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "location" text;`)
    await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "website_url" text;`)
    await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "linkedin_url" text;`)
  } catch (error) {
    console.error('Failed to add profile columns to users table:', error)
  }
}

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const MAX_AVATAR_BYTES = 5 * 1024 * 1024 // 5MB

/**
 * Uploads an avatar. The file is written under a SHA-256 content-hash name and
 * returns the plaintext path for client preview. It is not saved to the database
 * until the user clicks "Save changes".
 */
export async function uploadAvatar(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Not authenticated' }

  const file = formData.get('file') as File | null
  if (!file || typeof file === 'string') return { success: false, error: 'No file provided' }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { success: false, error: 'Image must be PNG, JPEG, WebP or GIF' }
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { success: false, error: 'Image must be under 5MB' }
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const hash = createHash('sha256').update(buffer).digest('hex')
    const ext = (extname(file.name) || '.png').toLowerCase().replace(/[^.a-z0-9]/g, '') || '.png'
    const fileName = `${hash}${ext}`

    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    await mkdir(uploadsDir, { recursive: true })
    await writeFile(join(uploadsDir, fileName), buffer)

    const publicPath = `/uploads/avatars/${fileName}`
    return { success: true, url: publicPath }
  } catch (error) {
    console.error('Avatar upload failed:', error)
    return { success: false, error: 'Upload failed on server' }
  }
}

export interface ProfileUpdateInput {
  name?: string
  headline?: string
  bio?: string
  location?: string
  githubUrl?: string
  linkedinUrl?: string
  websiteUrl?: string
  avatarUrl?: string | null
}

export async function updateProfile(data: ProfileUpdateInput) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Not authenticated' }

  await ensureProfileColumns()

  const clean = (v?: string) => {
    const t = v?.trim()
    return t ? t : null
  }

  const set: Record<string, unknown> = {
    headline: clean(data.headline),
    bio: clean(data.bio),
    location: clean(data.location),
    githubUrl: clean(data.githubUrl),
    linkedinUrl: clean(data.linkedinUrl),
    websiteUrl: clean(data.websiteUrl),
  }
  // name is NOT NULL — only overwrite when a non-empty value is supplied.
  const name = data.name?.trim()
  if (name) set.name = name

  if (data.avatarUrl !== undefined) {
    set.image = data.avatarUrl ? encryptUrl(data.avatarUrl) : null
  }

  try {
    await db.update(users).set(set).where(eq(users.id, session.user.id))
    revalidatePath('/[username]', 'page')
    revalidatePath('/profile')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Profile update failed:', error)
    return { success: false, error: 'Could not save profile' }
  }
}

/**
 * Fetches linked avatar URLs from OAuth providers (GitHub, Google).
 * Returns whichever are available for the current user.
 */
export async function getLinkedAvatars(): Promise<{ github: string | null; google: string | null }> {
  const session = await auth()
  if (!session?.user?.id) return { github: null, google: null }

  let githubAvatar: string | null = null
  let googleAvatar: string | null = null

  try {
    // GitHub avatar from the githubProfiles table
    const ghProfile = await db.query.githubProfiles.findFirst({
      where: eq(githubProfiles.userId, session.user.id),
    })
    if (ghProfile?.avatarUrl) {
      githubAvatar = ghProfile.avatarUrl
    }

    // Google avatar from the accounts table + users.image (original OAuth image)
    const googleAccount = await db.query.accounts.findFirst({
      where: eq(accounts.userId, session.user.id),
    })
    if (googleAccount?.provider === 'google') {
      // The original OAuth image was stored in users.image on first sign-in
      // We can construct the Google avatar from the providerAccountId
      googleAvatar = `https://lh3.googleusercontent.com/a/${googleAccount.providerAccountId}`
    }

    // Also check all accounts for any Google one
    const allAccounts = await db.select().from(accounts).where(eq(accounts.userId, session.user.id))
    for (const acct of allAccounts) {
      if (acct.provider === 'github' && !githubAvatar) {
        // Fallback: construct from provider account ID
        githubAvatar = `https://avatars.githubusercontent.com/u/${acct.providerAccountId}`
      }
      if (acct.provider === 'google' && !googleAvatar) {
        googleAvatar = `https://lh3.googleusercontent.com/a/${acct.providerAccountId}`
      }
    }
  } catch (error) {
    console.error('Error fetching linked avatars:', error)
  }

  return { github: githubAvatar, google: googleAvatar }
}
