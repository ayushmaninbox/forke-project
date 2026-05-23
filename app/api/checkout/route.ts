import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SITE_PASSWORD = 'Password#6#7'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    if (password !== SITE_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password.' },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set('site_access', 'granted', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong.' },
      { status: 500 }
    )
  }
}
