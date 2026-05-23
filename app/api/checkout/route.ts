import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const DEFAULT_BYPASS_HASH = '$2b$10$JEQiYsDtj2tUN2SXWMsYBu6g/cXZfWa5fDcYg0t32TSUx5NQklJpy'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    // Allow overriding bypass password via environment variable (git-ignored)
    let customBypass = process.env.WAITLIST_BYPASS_PASSWORD
    if (customBypass && customBypass.startsWith('"') && customBypass.endsWith('"')) {
      customBypass = customBypass.slice(1, -1)
    }
    const isMatch = customBypass 
      ? (password === customBypass)
      : (await bcrypt.compare(password, DEFAULT_BYPASS_HASH))

    if (!isMatch) {
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
