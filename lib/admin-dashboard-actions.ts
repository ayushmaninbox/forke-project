'use server'

import { db } from './db'
import { users, owners } from './db/schema'
import { eq, and } from 'drizzle-orm'
import { isAdminAuthenticated } from './admin-actions'
import { revalidatePath } from 'next/cache'

async function ensureAdmin() {
  if (!await isAdminAuthenticated()) {
    throw new Error('Unauthorized')
  }
}

export async function getPendingOwners() {
  await ensureAdmin()
  return await db.select({
    user: users,
    owner: owners
  })
  .from(users)
  .innerJoin(owners, eq(users.id, owners.id))
  .where(eq(users.isApproved, false))
}

export async function getApprovedOwners() {
  await ensureAdmin()
  return await db.select({
    user: users,
    owner: owners
  })
  .from(users)
  .innerJoin(owners, eq(users.id, owners.id))
  .where(eq(users.isApproved, true))
}

export async function getDevelopers() {
  await ensureAdmin()
  return await db.select().from(users).where(eq(users.role, 'developer'))
}

export async function approveOwner(userId: string) {
  await ensureAdmin()
  await db.update(users).set({ isApproved: true }).where(eq(users.id, userId))
  revalidatePath('/admin')
  return { success: true }
}

export async function declineOwner(userId: string) {
  await ensureAdmin()
  // This will cascade delete from owners table due to FK
  await db.delete(users).where(eq(users.id, userId))
  revalidatePath('/admin')
  return { success: true }
}

export async function toggleDeveloperBan(userId: string, shouldBan: boolean) {
  await ensureAdmin()
  await db.update(users).set({ isBanned: shouldBan }).where(eq(users.id, userId))
  revalidatePath('/admin')
  return { success: true }
}
