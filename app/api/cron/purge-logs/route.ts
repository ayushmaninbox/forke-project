import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuditLog } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import { logAudit } from '@/lib/actions/audit-actions'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Check CRON_SECRET for security
  const authHeader = request.headers.get('authorization')
  const searchParams = request.nextUrl.searchParams
  const secretParam = searchParams.get('secret')
  const cronSecret = process.env.CRON_SECRET

  // Allow authorization header (e.g. "Bearer <secret>") or query parameter "?secret=<secret>"
  const token = authHeader ? authHeader.replace('Bearer ', '').trim() : secretParam

  // Validate request. Vercel Cron requests include a specific header (which we can check if CRON_SECRET is configured)
  const isVercelCron = request.headers.get('x-vercel-cron') === 'true'
  
  if (cronSecret && token !== cronSecret && !isVercelCron) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Purge logs older than 7 days
    await db.delete(adminAuditLog).where(sql`created_at < now() - interval '7 days'`)
    
    // Log the purge action itself in the database
    await logAudit({
      category: 'system',
      action: 'system.logs_purged_cron',
      target: 'Logs older than 7 days via automated cron'
    })

    return NextResponse.json({ success: true, message: 'Audit logs older than 7 days purged successfully' })
  } catch (error: any) {
    console.error('Cron purge logs API error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Purging failed' }, { status: 500 })
  }
}
