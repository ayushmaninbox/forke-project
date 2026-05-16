import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isBanned = (req.auth?.user as any)?.isBanned
  const isAppPage = req.nextUrl.pathname.startsWith('/dashboard') || 
                    req.nextUrl.pathname.startsWith('/tasks') ||
                    req.nextUrl.pathname.startsWith('/profile') ||
                    req.nextUrl.pathname.startsWith('/submissions') ||
                    req.nextUrl.pathname.startsWith('/earnings')
  
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
  const isAdminLogin = req.nextUrl.pathname === '/admin/login'

  // Block banned users
  if (isLoggedIn && isBanned && !isAdminPage && !req.nextUrl.pathname.startsWith('/auth-error')) {
     const errorUrl = new URL('/auth-error?error=AccessDenied', req.nextUrl.origin)
     return NextResponse.redirect(errorUrl)
  }

  // Admin protection
  if (isAdminPage && !isAdminLogin) {
    const adminToken = req.cookies.get('admin_token')?.value
    if (adminToken !== 'forke_admin_session') {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl.origin))
    }
  }

  if (isAppPage && !isLoggedIn) {
    const loginUrl = new URL('/', req.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logged in users from root to dashboard
  if (isLoggedIn && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }

  // Onboarding redirection for developers without githubUrl or username
  const role = (req.auth?.user as any)?.role
  const githubUrl = (req.auth?.user as any)?.githubUrl
  const username = (req.auth?.user as any)?.username
  const isOnboardingPage = req.nextUrl.pathname === '/onboarding'

  const needsOnboarding = role === 'developer' && (!githubUrl || !username)

  if (isLoggedIn && needsOnboarding && !isOnboardingPage && isAppPage) {
    return NextResponse.redirect(new URL('/onboarding', req.nextUrl.origin))
  }

  // Prevent users who don't need onboarding from accessing it
  if (isLoggedIn && !needsOnboarding && isOnboardingPage) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
