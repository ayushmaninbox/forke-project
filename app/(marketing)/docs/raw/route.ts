import { getDocsIndexMarkdown } from '../content'

/** Serves the docs home index as raw Markdown ("View as Markdown"). */
export async function GET() {
  return new Response(getDocsIndexMarkdown(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
