'use server'

import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const ADMIN_USERNAME = 'ayushmaninbox'
const ADMIN_PASSWORD_HASH = '$2b$10$u/o97bSN.LxU1VxIP7RvZO98DxJ0slaeJiUhAIp0szm1UCgmAftN.' // pupulu123

export async function adminLogin(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (username === ADMIN_USERNAME && await bcrypt.compare(password, ADMIN_PASSWORD_HASH)) {
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
