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
  if (isLoggedIn && isBanned && !isAdminPage) {
     const logoutUrl = new URL('/signin', req.nextUrl.origin)
     return NextResponse.redirect(logoutUrl)
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
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
