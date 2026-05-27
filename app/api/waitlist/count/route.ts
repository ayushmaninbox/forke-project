import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscribers)
    
    const count = Number(result[0]?.count || 0)
    return NextResponse.json({ success: true, count })
  } catch (error) {
    console.error('Waitlist count API error:', error)
    return NextResponse.json({ success: false, count: 0 }, { status: 500 })
  }
}
