import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import crypto from 'crypto'
import { isAdminAuthenticated } from '@/lib/admin-actions'

// Route handlers have no 1MB Server-Action body cap, so full-resolution images
// upload fine here. Files land in /public/uploads/blogs and are served as
// /uploads/blogs/*.
// This is the local-disk bridge until R2 is connected — swap the write below
// for an R2 PUT and keep the same response shape.

export const runtime = 'nodejs'

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const MAX_BYTES = 25 * 1024 * 1024 // generous — quality preserved, no recompression here

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image exceeds 25 MB' }, { status: 413 })
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const name = `${crypto.randomUUID()}.${EXT[file.type] ?? 'jpg'}`
  const dir = join(process.cwd(), 'public', 'uploads', 'blogs')
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, name), bytes)

  return NextResponse.json({ url: `/uploads/blogs/${name}` })
}
