import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  const cookieOpts = {
    path: '/',
    maxAge: 0,
  }
  
  response.cookies.set('forke_access_token', '', cookieOpts)
  response.cookies.set('forke_role', '', cookieOpts)
  response.cookies.set('forke_username', '', cookieOpts)
  
  return response
}
