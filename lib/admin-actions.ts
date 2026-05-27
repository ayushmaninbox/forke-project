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

  const input = username.trim().toLowerCase()

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
    // Record login timing
    await db
      .update(admins)
      .set({ lastLoginAt: new Date() })
      .where(eq(admins.id, admin.id))

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

