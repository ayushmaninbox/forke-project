'use client'

import { useEffect } from 'react'

export default function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/blog-view/${slug}`, { method: 'POST' }).catch(() => {})
  }, [slug])

  return null
}
