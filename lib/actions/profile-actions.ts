'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
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
 * its path is stored AES-256-GCM encrypted on the user row, so the real file
 * location is never exposed in the database or HTML.
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
    // Store the path encrypted so the raw location never leaves the server in cleartext.
    await db.update(users).set({ image: encryptUrl(publicPath) }).where(eq(users.id, session.user.id))

    revalidatePath('/[username]', 'page')
    // Return the plaintext path for instant client preview.
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

  try {
    await db.update(users).set(set).where(eq(users.id, session.user.id))
    revalidatePath('/[username]', 'page')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Profile update failed:', error)
    return { success: false, error: 'Could not save profile' }
  }
}
