import { NextRequest, NextResponse } from 'next/server'
import { incrementBlogView } from '@/lib/blog-actions'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  await incrementBlogView(slug)
  return NextResponse.json({ ok: true })
}
