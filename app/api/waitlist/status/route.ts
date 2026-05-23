import { NextResponse } from 'next/server'
import { isWaitlistEnabled } from '@/lib/db/settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const enabled = await isWaitlistEnabled()
    return NextResponse.json({ enabled })
  } catch (error) {
    console.error('Waitlist status API error:', error)
    return NextResponse.json({ enabled: true }) // Fallback
  }
}
