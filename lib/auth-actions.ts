'use server'

import { signIn, signOut } from '@/auth'
import { cookies } from 'next/headers'

export async function signInWithGoogle(role?: 'developer' | 'client', redirectTo?: string) {
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

export async function signInWithGitHub(role?: 'developer' | 'client', redirectTo?: string) {
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
