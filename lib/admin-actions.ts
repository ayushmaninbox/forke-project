'use server'

import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { admins } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function adminLogin(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  let adminUsername = process.env.ADMIN_USERNAME
  let adminPassword = process.env.ADMIN_PASSWORD

  // Strip accidental surrounding double quotes (e.g. from Vercel env dashboard)
  if (adminUsername && adminUsername.startsWith('"') && adminUsername.endsWith('"')) {
    adminUsername = adminUsername.slice(1, -1)
  }
  if (adminPassword && adminPassword.startsWith('"') && adminPassword.endsWith('"')) {
    adminPassword = adminPassword.slice(1, -1)
  }

  // Auto-seed/update the admin user in Neon DB on login attempt
  if (adminUsername && adminPassword && username === adminUsername) {
    try {
      const hash = await bcrypt.hash(adminPassword, 10)
      await db
        .insert(admins)
        .values({
          username: adminUsername,
          passwordHash: hash,
        })
        .onConflictDoUpdate({
          target: admins.username,
          set: { passwordHash: hash },
        })
    } catch (e) {
      console.error('Failed to auto-provision admin user:', e)
    }
  }

  // Query the admins table — no hardcoded credentials
  const admin = await db
    .select()
    .from(admins)
    .where(eq(admins.username, username))
    .limit(1)
    .then((rows) => rows[0])

  if (admin && await bcrypt.compare(password, admin.passwordHash)) {
    const cookieStore = await cookies()
    cookieStore.set('admin_token', 'forke_admin_session', {
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

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_token')?.value === 'forke_admin_session'
}
