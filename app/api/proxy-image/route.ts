import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) {
    return new Response('Missing url parameter', { status: 400 })
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      return new Response('Failed to fetch remote image', { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const arrayBuffer = await response.arrayBuffer()

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return new Response('Error proxying image', { status: 500 })
  }
}
