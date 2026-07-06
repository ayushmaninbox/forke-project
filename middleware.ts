import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const { auth } = NextAuth(authConfig)

const ATTRIBUTION_COOKIE = 'forke_attribution'
const SESSION_COOKIE = 'forke_session'

/** Random first-party id used to join a visit to the signup it later produces. Edge-safe (Web Crypto). */
function newSessionId(): string {
  return crypto.randomUUID()
}

/**
 * Fire a non-blocking visit-track ping to the Node /api/track route. Edge middleware can't
 * touch postgres-js, so the Node route does the DB insert. We never await this — a tracking
 * failure must never slow down or block the page.
 */
function trackVisit(
  origin: string,
  sessionId: string,
  attribution: { source: string; medium?: string; campaign?: string; referrer?: string; landingPage?: string },
  userAgent: string | null,
) {
  try {
    const url = new URL('/api/track', origin)
    if (url.hostname === 'localhost') url.hostname = '127.0.0.1'
    void fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(userAgent ? { 'user-agent': userAgent } : {}) },
      body: JSON.stringify({
        sessionId,
        source: attribution.source,
        medium: attribution.medium,
        campaign: attribution.campaign,
        referrer: attribution.referrer,
        landingPath: attribution.landingPage,
      }),
      cache: 'no-store',
      keepalive: true,
    }).catch(() => {})
  } catch {
    // never throw from tracking
  }
}

// Edge-safe copy of normalizeSource (middleware can't import next/headers from the shared util).
function normalizeSource(raw?: string | null): string {
  if (!raw) return 'direct'
  const cleaned = raw.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '').slice(0, 32)
  return cleaned || 'direct'
}

function cleanField(raw?: string | null): string | undefined {
  if (!raw) return undefined
  const cleaned = raw.toLowerCase().trim().replace(/[^a-z0-9_\- ]/g, '').slice(0, 64)
  return cleaned || undefined
}

// Query params we capture then strip from the visible URL.
const TRACKING_PARAMS = ['source', 'utm_source', 'ref', 'utm_medium', 'utm_campaign']

/**
 * Compute first-touch attribution from the request, or null if there's nothing to record
 * (cookie already set, or no tracking signal at all). Pure — does not mutate anything.
 *
 * First-touch wins: once the cookie exists we never recompute, so a signup days later
 * (even via OAuth) is still credited to the original channel.
 */
function computeAttribution(req: NextRequest) {
  if (req.cookies.get(ATTRIBUTION_COOKIE)) return null

  const params = req.nextUrl.searchParams
  const rawSource = params.get('source') || params.get('utm_source') || params.get('ref')
  const medium = params.get('utm_medium')
  const campaign = params.get('utm_campaign')

  const referrerHeader = req.headers.get('referer') || ''
  let externalReferrer: string | undefined
  if (referrerHeader) {
    try {
      // Normalize hosts (drop "www.") so forke.space and www.forke.space both count as "self".
      // Behind Vercel, req.nextUrl.host can be an internal deployment host, so we also trust the
      // forwarded host header and a known production host to reliably recognize self-referrals.
      const stripWww = (h: string) => h.replace(/^www\./, '').toLowerCase()
      const refHost = stripWww(new URL(referrerHeader).host)
      const selfHosts = new Set(
        [
          req.nextUrl.host,
          req.headers.get('x-forwarded-host') || '',
          'forke.space',
        ]
          .filter(Boolean)
          .map(stripWww),
      )
      if (refHost && !selfHosts.has(refHost)) externalReferrer = referrerHeader.slice(0, 255)
    } catch {
      // ignore malformed referrer
    }
  }

  // Only record when there's a real signal — otherwise let "direct" stay the honest default.
  if (!rawSource && !medium && !campaign && !externalReferrer) return null

  return {
    source: normalizeSource(rawSource),
    medium: cleanField(medium),
    campaign: cleanField(campaign),
    referrer: externalReferrer,
    landingPage: req.nextUrl.pathname.slice(0, 255),
    firstSeenAt: new Date().toISOString(),
  }
}

/** Write the attribution cookie onto a response (90-day, first-party). */
function setAttributionCookie(res: NextResponse, attribution: object) {
  res.cookies.set(ATTRIBUTION_COOKIE, encodeURIComponent(JSON.stringify(attribution)), {
    path: '/',
    maxAge: 60 * 60 * 24 * 90, // 90 days
    sameSite: 'lax',
  })
}

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

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname

  // Bypass all static files and system assets containing a dot (like .glb, .svg, .png, etc.)
  // and Next.js internal /_next paths or custom /uploads paths.
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname.endsWith('/opengraph-image')
  ) {
    return NextResponse.next()
  }

  // Redirect /@username to /username
  if (pathname.startsWith('/@')) {
    const targetPath = pathname.replace('/@', '/')
    const redirectUrl = new URL(targetPath, req.nextUrl.origin)
    redirectUrl.search = req.nextUrl.search
    return NextResponse.redirect(redirectUrl)
  }

  // ===== ATTRIBUTION CAPTURE + CLEAN-URL REDIRECT =====
  // If the visitor arrived with tracking params (?source=, utm_*, ?ref=), capture them into the
  // first-touch cookie, then redirect to the same URL WITHOUT those params. This keeps the address
  // bar clean — so if the visitor later shares the page from their browser, they share a plain link
  // and don't accidentally pass their own attribution on to the next person.
  const consent = req.cookies.get('forke_cookie_consent')?.value
  const isConsentDeclined = consent === 'declined'

  const hasTrackingParams = TRACKING_PARAMS.some((p) => req.nextUrl.searchParams.has(p))
  if (hasTrackingParams) {
    const cleanUrl = new URL(req.nextUrl.pathname, req.nextUrl.origin)
    // Preserve any non-tracking query params the page may legitimately use (e.g. ?email=).
    req.nextUrl.searchParams.forEach((value, key) => {
      if (!TRACKING_PARAMS.includes(key)) cleanUrl.searchParams.set(key, value)
    })
    const redirect = NextResponse.redirect(cleanUrl)

    if (isConsentDeclined) {
      redirect.cookies.delete(ATTRIBUTION_COOKIE)
      redirect.cookies.delete(SESSION_COOKIE)
    } else {
      const attribution = computeAttribution(req)
      if (attribution) {
        setAttributionCookie(redirect, attribution)
        // Ensure a session id exists, then record the click (non-blocking).
        let sessionId = req.cookies.get(SESSION_COOKIE)?.value
        if (!sessionId) {
          sessionId = newSessionId()
          redirect.cookies.set(SESSION_COOKIE, sessionId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 90, // 90 days, matches attribution cookie
            sameSite: 'lax',
          })
        }
        trackVisit(req.nextUrl.origin, sessionId, attribution, req.headers.get('user-agent'))
      }
    }
    return redirect
  }

  const siteAccess = req.cookies.get('site_access')?.value
  const waitlistJoined = req.cookies.get('waitlist_joined')?.value
  const waitlistEnabled = await fetchWaitlistStatus(req.nextUrl.origin)

  // Helper function to append tracking cookies and disable page cache
  const withCookies = (res: NextResponse) => {
    res.cookies.set('site_access_public', siteAccess ? 'true' : 'false', { path: '/' })
    res.cookies.set('waitlist_active', waitlistEnabled ? 'true' : 'false', { path: '/' })
    
    if (isConsentDeclined) {
      res.cookies.delete(ATTRIBUTION_COOKIE)
      res.cookies.delete(SESSION_COOKIE)
    } else {
      // Capture attribution for requests that aren't being redirected to a clean URL below
      // (e.g. an external referrer with no UTM tags — nothing to strip from the address bar).
      const attribution = computeAttribution(req)
      if (attribution && !TRACKING_PARAMS.some((p) => req.nextUrl.searchParams.has(p))) {
        setAttributionCookie(res, attribution)
        let sessionId = req.cookies.get(SESSION_COOKIE)?.value
        if (!sessionId) {
          sessionId = newSessionId()
          res.cookies.set(SESSION_COOKIE, sessionId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 90,
            sameSite: 'lax',
          })
        }
        trackVisit(req.nextUrl.origin, sessionId, attribution, req.headers.get('user-agent'))
      }
    }
    // Public, indexable surfaces (blogs/docs/changelog) must stay cacheable so
    // crawlers don't treat them as no-store. Everything else is per-visitor
    // (gated/auth-aware) and must not be cached.
    const isIndexableSurface =
      pathname === '/blogs' ||
      pathname.startsWith('/blogs/') ||
      pathname === '/docs' ||
      pathname.startsWith('/docs/') ||
      pathname === '/changelog'
    if (
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api') &&
      pathname !== '/favicon.ico' &&
      !isIndexableSurface
    ) {
      res.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate')
    }
    return res
  }
  // ===== SUBDOMAIN ROUTING & REDIRECTS =====
  const host = req.headers.get('host') || ''
  const isDashboardSubdomain = host.startsWith('dashboard.')
  const isAdminSubdomain = host.startsWith('admin.')

  // Detect localhost to enable testing subdomains dynamically
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
  const port = host.split(':')[1]
  const portSuffix = port ? `:${port}` : ''

  const dashboardBase = isLocalhost ? `http://dashboard.localhost${portSuffix}` : 'https://dashboard.forke.space'
  const adminBase = isLocalhost ? `http://admin.localhost${portSuffix}` : 'https://admin.forke.space'
  const mainBase = isLocalhost ? `http://localhost${portSuffix}` : 'https://forke.space'

  // 1. Redirections from the main domain (forke.space) to subdomains
  if (!isDashboardSubdomain && !isAdminSubdomain) {
    if (pathname === '/dashboard') {
      return withCookies(NextResponse.redirect(new URL('/overview', dashboardBase)))
    }

    const isAppRoute = pathname.startsWith('/tasks') ||
                       pathname.startsWith('/profile') ||
                       pathname.startsWith('/submissions') ||
                       pathname.startsWith('/earnings') ||
                       pathname.startsWith('/settings') ||
                       pathname.startsWith('/analytics') ||
                       pathname.startsWith('/messages') ||
                       pathname.startsWith('/onboarding') ||
                       pathname.startsWith('/support') ||
                       pathname.startsWith('/post-task')

    if (isAppRoute) {
      return withCookies(NextResponse.redirect(new URL(pathname + req.nextUrl.search, dashboardBase)))
    }

    if (pathname.startsWith('/admin')) {
      const cleanAdminPath = pathname.replace(/^\/admin/, '') || '/'
      return withCookies(NextResponse.redirect(new URL(cleanAdminPath + req.nextUrl.search, adminBase)))
    }
  }

  // 2. Redirections on dashboard.forke.space
  if (isDashboardSubdomain) {
    if (pathname === '/' || pathname === '/dashboard') {
      return withCookies(NextResponse.redirect(new URL('/overview', dashboardBase)))
    }
  }

  // 3. Redirections on admin.forke.space
  if (isAdminSubdomain) {
    if (pathname.startsWith('/admin')) {
      const cleanAdminPath = pathname.replace(/^\/admin/, '') || '/'
      return withCookies(NextResponse.redirect(new URL(cleanAdminPath + req.nextUrl.search, adminBase)))
    }
  }

  // ===== WAITLIST GATE =====
  // New model: the waitlist no longer locks visitors OUT of public pages.
  // Whether the lock is on or off, every public/marketing surface (landing,
  // blogs, docs, levels, profiles, etc.) renders normally — CTAs read "Join the
  // waitlist" while the lock is on (driven by the waitlist_active cookie below).
  // Real app pages stay protected by the auth gate further down. So there is no
  // waitlist redirect for public pages anymore.
  //
  // The only waitlist-aware redirect left is the /waitlist page itself:
  //  - lock ON + already joined / has access  -> bounce home (nothing to do here)
  //  - lock OFF                                -> the route renders a 404 (handled
  //    in app/waitlist/layout.tsx via notFound(); we don't redirect here so the
  //    not-found UI shows the real URL).
  if (pathname === '/waitlist' && waitlistEnabled && (siteAccess || waitlistJoined)) {
    const redirectUrl = new URL('/', mainBase)
    redirectUrl.search = req.nextUrl.search
    return withCookies(NextResponse.redirect(redirectUrl))
  }

  // ===== EXISTING AUTH LOGIC =====
  const isLoggedIn = !!req.auth
  const isBanned = (req.auth?.user as any)?.isBanned
  const isAppPage = isDashboardSubdomain ||
                    req.nextUrl.pathname.startsWith('/dashboard') || 
                    req.nextUrl.pathname.startsWith('/tasks') ||
                    req.nextUrl.pathname.startsWith('/profile') ||
                    req.nextUrl.pathname.startsWith('/submissions') ||
                    req.nextUrl.pathname.startsWith('/earnings') ||
                    req.nextUrl.pathname.startsWith('/settings') ||
                    req.nextUrl.pathname.startsWith('/analytics') ||
                    req.nextUrl.pathname.startsWith('/messages') ||
                    req.nextUrl.pathname.startsWith('/onboarding') ||
                    req.nextUrl.pathname.startsWith('/support') ||
                    req.nextUrl.pathname.startsWith('/post-task')
  
  const isAdminPage = isAdminSubdomain || req.nextUrl.pathname.startsWith('/admin')
  const isAdminLogin = (isAdminSubdomain && pathname === '/login') || req.nextUrl.pathname === '/admin/login'
  const isAdminSetup = (isAdminSubdomain && pathname === '/setup') || req.nextUrl.pathname === '/admin/setup'

  // Block banned users
  if (isLoggedIn && isBanned && !isAdminPage && !req.nextUrl.pathname.startsWith('/auth-error')) {
     const errorUrl = new URL('/auth-error?error=AccessDenied', mainBase)
     return withCookies(NextResponse.redirect(errorUrl))
  }

  // Admin protection
  if (isAdminPage && !isAdminLogin && !isAdminSetup) {
    const adminToken = req.cookies.get('admin_token')?.value
    if (!adminToken || !adminToken.startsWith('forke_admin_session:')) {
      return withCookies(NextResponse.redirect(new URL('/login', adminBase)))
    }
  }

  if (isAppPage && !isLoggedIn) {
    const loginUrl = new URL('/', mainBase)
    return withCookies(NextResponse.redirect(loginUrl))
  }

  // Redirect logged in users from root to dashboard (only if waitlist is disabled or they have site access)
  if (isLoggedIn && !isDashboardSubdomain && !isAdminSubdomain && pathname === '/' && (!waitlistEnabled || siteAccess)) {
    return withCookies(NextResponse.redirect(new URL('/overview', dashboardBase)))
  }

  // Onboarding redirection for developers without username
  const role = (req.auth?.user as any)?.role
  const username = (req.auth?.user as any)?.username
  const isOnboardingPage = pathname === '/onboarding'

  const needsOnboarding = role === 'developer' && !username

  if (isLoggedIn && needsOnboarding && !isOnboardingPage && isAppPage) {
    return withCookies(NextResponse.redirect(new URL('/onboarding', dashboardBase)))
  }

  // Prevent users who don't need onboarding from accessing it
  if (isLoggedIn && !needsOnboarding && isOnboardingPage) {
    return withCookies(NextResponse.redirect(new URL('/overview', dashboardBase)))
  }
  
  // ===== INTERNAL SUBDOMAIN REWRITES =====
  if (isAdminSubdomain) {
    return NextResponse.rewrite(new URL(`/admin${pathname}${req.nextUrl.search}`, req.url))
  }

  if (isDashboardSubdomain) {
    if (pathname === '/overview') {
      return NextResponse.rewrite(new URL(`/dashboard${req.nextUrl.search}`, req.url))
    }
  }

  return withCookies(NextResponse.next())
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|glb|gltf|svg|jpg|jpeg|gif|webp|ico|css|js|woff2?|json)$|.*\\/opengraph-image$).*)'],
}
