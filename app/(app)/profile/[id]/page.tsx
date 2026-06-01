import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'

// Profiles are consolidated onto the single public route (/<username>).
// This legacy id-based route now just resolves the username and redirects,
// so existing internal links keep working without a separate chrome.
export default async function ProfileDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { username: true },
  })

  if (!dbUser?.username) notFound()

  redirect(`/${dbUser.username}`)
}
