'use server'

import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { admins } from '@/lib/db/schema'
import { eq, or } from 'drizzle-orm'

export async function adminLogin(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { success: false, error: 'Please supply a username and password.' }
  }

  let adminUsername = process.env.ADMIN_USERNAME || ''
  let adminPassword = process.env.ADMIN_PASSWORD || ''
  let adminEmail = process.env.ADMIN_EMAIL || ''
  let adminName = process.env.ADMIN_NAME || ''
  let adminRole = process.env.ADMIN_ROLE || 'super_admin'

  const stripQuotes = (str: string) => {
    if (str.startsWith('"') && str.endsWith('"')) return str.slice(1, -1)
    if (str.startsWith("'") && str.endsWith("'")) return str.slice(1, -1)
    return str
  }

  adminUsername = stripQuotes(adminUsername).trim()
  adminPassword = stripQuotes(adminPassword).trim()
  adminEmail = stripQuotes(adminEmail).trim().toLowerCase()
  adminName = stripQuotes(adminName).trim()
  adminRole = stripQuotes(adminRole).trim()

  const input = username.trim().toLowerCase()

  // Auto-seed/update the default super admin in DB from environment variables
  if (adminEmail && adminPassword && (input === adminUsername.toLowerCase() || input === adminEmail)) {
    try {
      const hash = await bcrypt.hash(adminPassword, 10)
      const existing = await db
        .select()
        .from(admins)
        .where(eq(admins.email, adminEmail))
        .limit(1)
        .then((rows) => rows[0])

      if (!existing) {
        await db
          .insert(admins)
          .values({
            email: adminEmail,
            name: adminName,
            username: adminUsername,
            passwordHash: hash,
            role: adminRole,
          })
          .onConflictDoNothing()
      } else if (!existing.username || !existing.passwordHash) {
        await db
          .update(admins)
          .set({
            username: adminUsername,
            passwordHash: hash,
          })
          .where(eq(admins.id, existing.id))
      }
    } catch (e) {
      console.error('Failed to auto-provision default admin user:', e)
    }
  }

  // Query by username, primary email, or alternative email
  const admin = await db
    .select()
    .from(admins)
    .where(
      or(
        eq(admins.username, input),
        eq(admins.email, input),
        eq(admins.alternativeEmail, input)
      )
    )
    .limit(1)
    .then((rows) => rows[0])

  // Verify account is not disabled
  if (admin && admin.isDisabled) {
    return { success: false, error: 'This administrative account has been disabled.' }
  }

  if (admin && admin.passwordHash && await bcrypt.compare(password, admin.passwordHash)) {
    const cookieStore = await cookies()
    cookieStore.set('admin_token', `forke_admin_session:${admin.id}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    return { success: true }
  }

  return { success: false, error: 'Invalid credentials' }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token || !token.startsWith('forke_admin_session:')) {
      return null
    }
    const id = token.split(':')[1]
    if (!id) return null

    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.id, id))
      .limit(1)
      .then((rows) => rows[0])

    return admin || null
  } catch (error) {
    console.error('Error in getCurrentAdmin:', error)
    return null
  }
}

export async function isAdminAuthenticated() {
  const admin = await getCurrentAdmin()
  return !!admin
}

