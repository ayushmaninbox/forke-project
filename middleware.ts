import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

async function fetchWaitlistStatus(origin: string): Promise<boolean> {
  const url = new URL('/api/waitlist/status', origin)
  if (url.hostname === 'localhost') {
    url.hostname = '127.0.0.1'
  }
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return data.enabled
  } catch (e) {
    console.error('Failed to fetch waitlist status in middleware:', e)
    return true // Safe fallback
  }
}

function isPublicProfilePath(pathname: string): boolean {
  if (pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/uploads')) {
    return false
  }
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length !== 1) return false
  
  const reservedNames = [
    'waitlist', 'checkout', 'admin', 'api', 'signin', 'register', 'onboarding',
    'dashboard', 'profile', 'tasks', 'submissions', 'earnings', 'settings',
    'analytics', 'developers', 'escrow', 'messages', 'notifications', 'post-task',
    'support', 'auth-error', 'whats-forke', 'levels', 'contact', 'terms', 'privacy', 'refund'
  ]
  return !reservedNames.includes(segments[0])
}

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname
  const siteAccess = req.cookies.get('site_access')?.value
  const waitlistJoined = req.cookies.get('waitlist_joined')?.value
  const waitlistEnabled = await fetchWaitlistStatus(req.nextUrl.origin)

  // Helper function to append tracking cookies and disable page cache
  const withCookies = (res: NextResponse) => {
    res.cookies.set('site_access_public', siteAccess ? 'true' : 'false', { path: '/' })
    res.cookies.set('waitlist_active', waitlistEnabled ? 'true' : 'false', { path: '/' })
    if (!pathname.startsWith('/_next') && !pathname.startsWith('/api') && pathname !== '/favicon.ico') {
      res.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate')
    }
    return res
  }

  // ===== WAITLIST GATE =====
  const isWaitlistAllowed = 
    pathname === '/waitlist' ||
    pathname === '/checkout' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/waitlist') ||
    pathname.startsWith('/api/checkout') ||
    pathname.startsWith('/api/auth') ||
    isPublicProfilePath(pathname)

  // If waitlist is active and the user doesn't have site_access
  if (waitlistEnabled && !siteAccess && !isWaitlistAllowed) {
    if (waitlistJoined) {
      // Waitlisters can view marketing/policy pages
      const isMarketingPage =
        pathname === '/' ||
        pathname === '/whats-forke' ||
        pathname === '/levels' ||
        pathname === '/contact' ||
        pathname === '/terms' ||
        pathname === '/privacy' ||
        pathname === '/refund'

      if (!isMarketingPage) {
        // Redirect dashboard and real site pages to landing page
        const redirectUrl = new URL('/', req.nextUrl.origin)
        redirectUrl.search = req.nextUrl.search
        return withCookies(NextResponse.redirect(redirectUrl))
      }
    } else {
      // Redirect users who haven't joined to waitlist
      const redirectUrl = new URL('/waitlist', req.nextUrl.origin)
      redirectUrl.search = req.nextUrl.search
      return withCookies(NextResponse.redirect(redirectUrl))
    }
  }

  // If user HAS access (or waitlist is disabled, or already joined) and tries to visit /waitlist, redirect them to /
  if (pathname === '/waitlist') {
    if (!waitlistEnabled || siteAccess || waitlistJoined) {
      const redirectUrl = new URL('/', req.nextUrl.origin)
      redirectUrl.search = req.nextUrl.search
      return withCookies(NextResponse.redirect(redirectUrl))
    }
  }

  // ===== EXISTING AUTH LOGIC =====
  const isLoggedIn = !!req.auth
  const isBanned = (req.auth?.user as any)?.isBanned
  const isAppPage = req.nextUrl.pathname.startsWith('/dashboard') || 
                    req.nextUrl.pathname.startsWith('/tasks') ||
                    req.nextUrl.pathname.startsWith('/profile') ||
                    req.nextUrl.pathname.startsWith('/submissions') ||
                    req.nextUrl.pathname.startsWith('/earnings')
  
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
  const isAdminLogin = req.nextUrl.pathname === '/admin/login'
  const isAdminSetup = req.nextUrl.pathname === '/admin/setup'

  // Block banned users
  if (isLoggedIn && isBanned && !isAdminPage && !req.nextUrl.pathname.startsWith('/auth-error')) {
     const errorUrl = new URL('/auth-error?error=AccessDenied', req.nextUrl.origin)
     return withCookies(NextResponse.redirect(errorUrl))
  }

  // Admin protection
  if (isAdminPage && !isAdminLogin && !isAdminSetup) {
    const adminToken = req.cookies.get('admin_token')?.value
    if (!adminToken || !adminToken.startsWith('forke_admin_session:')) {
      return withCookies(NextResponse.redirect(new URL('/admin/login', req.nextUrl.origin)))
    }
  }

  if (isAppPage && !isLoggedIn) {
    const loginUrl = new URL('/', req.nextUrl.origin)
    return withCookies(NextResponse.redirect(loginUrl))
  }

  // Redirect logged in users from root to dashboard
  if (isLoggedIn && req.nextUrl.pathname === '/') {
    return withCookies(NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin)))
  }

  // Onboarding redirection for developers without username
  const role = (req.auth?.user as any)?.role
  const username = (req.auth?.user as any)?.username
  const isOnboardingPage = req.nextUrl.pathname === '/onboarding'

  const needsOnboarding = role === 'developer' && !username

  if (isLoggedIn && needsOnboarding && !isOnboardingPage && isAppPage) {
    return withCookies(NextResponse.redirect(new URL('/onboarding', req.nextUrl.origin)))
  }

  // Prevent users who don't need onboarding from accessing it
  if (isLoggedIn && !needsOnboarding && isOnboardingPage) {
    return withCookies(NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin)))
  }
  
  return withCookies(NextResponse.next())
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
