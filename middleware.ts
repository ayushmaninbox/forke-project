import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAppPage = req.nextUrl.pathname.startsWith('/dashboard') || 
                    req.nextUrl.pathname.startsWith('/tasks') ||
                    req.nextUrl.pathname.startsWith('/profile') ||
                    req.nextUrl.pathname.startsWith('/submissions') ||
                    req.nextUrl.pathname.startsWith('/earnings')

  if (isAppPage && !isLoggedIn) {
    const loginUrl = new URL('/', req.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
