import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { pageVisits } from '@/lib/db/schema'
import { normalizeSource } from '@/lib/utils/attribution'
import { getCountry, isBotUserAgent } from '@/lib/utils/analytics'

// Node runtime: postgres-js cannot run on the Edge, which is exactly why the Edge
// middleware pings THIS route (fire-and-forget) instead of inserting directly.
export const runtime = 'nodejs'

function clean(raw: unknown, max: number): string | null {
  if (typeof raw !== 'string') return null
  const v = raw.trim().slice(0, max)
  return v || null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))

    const ua = req.headers.get('user-agent')
    const isBot = isBotUserAgent(ua)

    // Don't write bot rows at all — keeps the table small and the charts human.
    if (isBot) return NextResponse.json({ ok: true, skipped: 'bot' })

    await db.insert(pageVisits).values({
      sessionId: clean(body.sessionId, 64),
      source: normalizeSource(typeof body.source === 'string' ? body.source : null),
      medium: clean(body.medium, 64),
      campaign: clean(body.campaign, 64),
      referrer: clean(body.referrer, 255),
      landingPath: clean(body.landingPath, 255),
      country: getCountry(req.headers),
      isBot: false,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    // Tracking must never break a page load — swallow and report 204-ish.
    console.error('track insert failed:', error)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
