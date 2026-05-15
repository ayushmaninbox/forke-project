import { isConsecutiveDay, isAlreadyLoggedInToday } from '@/lib/utils/streak'
import { getStreakXp, getLevelFromXp } from '@/lib/utils/xp'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function processLoginStreak(userId: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!user) return

  const now = new Date()

  // Already logged in today — do nothing
  if (user.lastLoginAt && isAlreadyLoggedInToday(user.lastLoginAt, now)) return

  let newStreak = 1
  if (user.lastLoginAt && isConsecutiveDay(user.lastLoginAt, now)) {
    newStreak = (user.currentStreak ?? 0) + 1
  }

  const xpGained = getStreakXp(newStreak)
  const newTotalXp = (user.xp ?? 0) + xpGained
  const newLevel = getLevelFromXp(newTotalXp)

  await db
    .update(users)
    .set({
      lastLoginAt: now,
      currentStreak: newStreak,
      xp: newTotalXp,
      level: newLevel,
    })
    .where(eq(users.id, userId))

  // Return metadata so the client can show a streak toast if needed
  return { xpGained, newStreak, leveledUp: newLevel > (user.level ?? 1), newLevel }
}

export async function signOutAction() {
  // Helper for components that need a server action for signout
  // This is often used in Sidebar or Profile buttons
}
