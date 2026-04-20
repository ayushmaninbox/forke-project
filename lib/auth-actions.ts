'use server'

import { signIn, signOut } from '@/auth'
import { cookies } from 'next/headers'

export async function signInWithGoogle(role: 'developer' | 'client') {
  const cookieStore = await cookies()
  cookieStore.set('forke_role', role, {
    path: '/',
    maxAge: 3600, // 1 hour
    httpOnly: false, // Allow client-side access if needed, though we primarily need it in auth events
    secure: process.env.NODE_ENV === 'production',
  })
  
  await signIn('google', { redirectTo: '/dashboard' })
}

export async function signOutAction() {
  await signOut()
}
