import { ALL_ARTICLES, getArticleMarkdown } from '../../content'

/** Serves a single docs article as raw Markdown ("View as Markdown"). */
export function generateStaticParams() {
  return ALL_ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const md = getArticleMarkdown(slug)
  if (!md) {
    return new Response('Not found', { status: 404 })
  }
  return new Response(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
