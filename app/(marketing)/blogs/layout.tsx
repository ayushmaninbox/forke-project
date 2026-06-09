import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'Stories, updates, and ideas from the Forke team.',
  alternates: { canonical: '/blogs' },
  openGraph: {
    title: 'The Forke Blogs',
    description: 'Stories, updates, and ideas from the Forke team.',
    url: 'https://www.forke.space/blogs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Forke Blogs',
    description: 'Stories, updates, and ideas from the Forke team.',
  },
}

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
