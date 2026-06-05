'use server'

import { db } from './db'
import { users, owners, subscribers, admins, developers, accounts } from './db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import { sendBroadcastEmail, sendAdminInvitation } from './email'
import { isAdminAuthenticated, getCurrentAdmin } from './admin-actions'
import { logAudit } from './actions/audit-actions'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { resolveAvatarUrl } from './utils/avatar'

async function ensureAdmin() {
  if (!await isAdminAuthenticated()) {
    throw new Error('Unauthorized')
  }
}

export async function getPendingOwners() {
  await ensureAdmin()
  const rows = await db.select({
    user: users,
    owner: owners
  })
  .from(users)
  .innerJoin(owners, eq(users.id, owners.id))
  .where(eq(users.isApproved, false))

  return rows.map((r) => ({
    ...r,
    user: {
      ...r.user,
      image: resolveAvatarUrl(r.user.image)
    }
  }))
}

export async function getApprovedOwners() {
  await ensureAdmin()
  const rows = await db.select({
    user: users,
    owner: owners
  })
  .from(users)
  .innerJoin(owners, eq(users.id, owners.id))
  .where(eq(users.isApproved, true))

  return rows.map((r) => ({
    ...r,
    user: {
      ...r.user,
      image: resolveAvatarUrl(r.user.image)
    }
  }))
}

export async function getDevelopers() {
  await ensureAdmin()
  const rows = await db
    .select({
      id: developers.id,
      githubId: developers.githubId,
      username: developers.username,
      accessToken: developers.accessToken,
      createdAt: developers.createdAt,
      userId: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      isBanned: users.isBanned,
    })
    .from(developers)
    .leftJoin(
      users,
      eq(developers.userId, users.id)
    )
    .orderBy(desc(developers.createdAt))

  return rows.map((r) => ({
    ...r,
    image: resolveAvatarUrl(r.image)
  }))
}

export async function approveOwner(userId: string) {
  await ensureAdmin()
  const u = await db.query.users.findFirst({ where: eq(users.id, userId), columns: { name: true, email: true } })
  await db.update(users).set({ isApproved: true }).where(eq(users.id, userId))
  await logAudit({ category: 'owner', action: 'owner.approved', target: u?.name || u?.email || userId })
  revalidatePath('/admin')
  return { success: true }
}

export async function declineOwner(userId: string) {
  await ensureAdmin()
  const u = await db.query.users.findFirst({ where: eq(users.id, userId), columns: { name: true, email: true } })
  // This will cascade delete from owners table due to FK
  await db.delete(users).where(eq(users.id, userId))
  await logAudit({ category: 'owner', action: 'owner.declined', target: u?.name || u?.email || userId })
  revalidatePath('/admin')
  return { success: true }
}

export async function toggleDeveloperBan(userId: string, shouldBan: boolean) {
  await ensureAdmin()
  const u = await db.query.users.findFirst({ where: eq(users.id, userId), columns: { name: true, username: true, email: true } })
  await db.update(users).set({ isBanned: shouldBan }).where(eq(users.id, userId))
  await logAudit({
    category: 'user',
    action: shouldBan ? 'developer.banned' : 'developer.unbanned',
    target: u?.username ? `@${u.username}` : u?.name || u?.email || userId,
  })
  revalidatePath('/admin')
  return { success: true }
}

import { 
  isWaitlistEnabled, 
  setWaitlistEnabled,
  getWaitlistBypassPassword,
  setWaitlistBypassPassword
} from './db/settings'

export async function getWaitlistConfig() {
  await ensureAdmin()
  const enabled = await isWaitlistEnabled()
  const bypassPassword = await getWaitlistBypassPassword()
  return { enabled, bypassPassword }
}

export async function updateWaitlistConfig(enabled: boolean, bypassPassword?: string) {
  await ensureAdmin()
  await setWaitlistEnabled(enabled)
  if (enabled && bypassPassword !== undefined) {
    await setWaitlistBypassPassword(bypassPassword)
  }
  await logAudit({ category: 'system', action: enabled ? 'waitlist.enabled' : 'waitlist.disabled', target: 'Waitlist gate' })
  revalidatePath('/admin')
  return { success: true }
}

export async function getSubscribers() {
  await ensureAdmin()
  try {
    const data = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt))
    return { success: true, data }
  } catch (error) {
    console.error('Failed to get subscribers:', error)
    return { success: false, error: 'Database query failed' }
  }
}

export async function deleteSubscriber(id: string) {
  await ensureAdmin()
  try {
    const sub = await db.query.subscribers.findFirst({ where: eq(subscribers.id, id), columns: { email: true } })
    await db.delete(subscribers).where(eq(subscribers.id, id))
    await logAudit({ category: 'system', action: 'subscriber.deleted', target: sub?.email || id })
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete subscriber:', error)
    return { success: false, error: 'Database deletion failed' }
  }
}

export async function getCurrentAdminAction() {
  await ensureAdmin()
  const admin = await getCurrentAdmin()
  return admin ? { success: true, admin } : { success: false, error: 'Not logged in' }
}

export async function getAdmins() {
  await ensureAdmin()
  const current = await getCurrentAdmin()
  if (!current || current.role !== 'super_admin') {
    return { success: false, error: 'Only Super Admins can access administrative records.' }
  }
  try {
    const list = await db.select().from(admins).orderBy(desc(admins.createdAt))
    // Redact password hash for transport
    const sanitized = list.map(({ passwordHash, ...rest }) => rest)
    return { success: true, data: sanitized }
  } catch (error) {
    console.error('Failed to get admins:', error)
    return { success: false, error: 'Failed to retrieve administrative records' }
  }
}

export async function inviteAdmin(
  name: string,
  email: string,
  role: 'super_admin' | 'admin',
  alternativeEmail?: string
) {
  await ensureAdmin()

  const current = await getCurrentAdmin()
  if (!current || current.role !== 'super_admin') {
    return { success: false, error: 'Only Super Admins can invite new administrators.' }
  }

  try {
    const existing = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.trim().toLowerCase()))
      .limit(1)
      .then((rows) => rows[0])

    if (existing) {
      return { success: false, error: 'An admin with this email already exists.' }
    }

    const inviteToken = crypto.randomUUID()
    const inviteExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days

    await db.insert(admins).values({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role,
      alternativeEmail: alternativeEmail?.trim() || null,
      inviteToken,
      inviteExpiresAt,
    })

    const baseUrl = process.env.AUTH_URL || 'https://forke.space'
    const inviteLink = `${baseUrl}/admin/setup?token=${inviteToken}`

    const emailSent = await sendAdminInvitation(email.trim().toLowerCase(), name.trim(), inviteLink)

    if (!emailSent) {
      console.warn('Admin record created, but invitation email failed to send.')
    }

    await logAudit({ category: 'admin', action: 'admin.invited', target: `${name.trim()} (${role})` })
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to invite admin:', error)
    return { success: false, error: 'Database transaction failed.' }
  }
}

export async function deleteAdmin(id: string) {
  await ensureAdmin()

  const current = await getCurrentAdmin()
  if (!current || current.role !== 'super_admin') {
    return { success: false, error: 'Only Super Admins possess system deletion overrides.' }
  }

  if (current.id === id) {
    return { success: false, error: 'System restriction: You cannot delete your own session.' }
  }

  try {
    const target = await db.query.admins.findFirst({ where: eq(admins.id, id), columns: { name: true, email: true } })
    await db.delete(admins).where(eq(admins.id, id))
    await logAudit({ category: 'admin', action: 'admin.deleted', target: target?.name || target?.email || id })
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete admin:', error)
    return { success: false, error: 'Administrative deletion override failed.' }
  }
}

export async function updateAdminProfile(name: string, username: string, alternativeEmail?: string) {
  await ensureAdmin()
  const current = await getCurrentAdmin()
  if (!current) {
    return { success: false, error: 'Session expired.' }
  }

  const cleanUsername = username.trim().toLowerCase()
  if (!cleanUsername) {
    return { success: false, error: 'Username is required.' }
  }

  // Regex to validate username format (alphanumeric and underscores, starting with letter, length 3-30)
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/
  if (!usernameRegex.test(cleanUsername)) {
    return {
      success: false,
      error: 'Username must start with a letter, be 3-30 characters long, and contain only letters, numbers, or underscores.'
    }
  }

  try {
    const existing = await db
      .select()
      .from(admins)
      .where(eq(admins.username, cleanUsername))
      .limit(1)
      .then((rows) => rows[0])

    if (existing && existing.id !== current.id) {
      return { success: false, error: 'Username is already taken by another administrator.' }
    }

    await db
      .update(admins)
      .set({
        name: name.trim(),
        username: cleanUsername,
        alternativeEmail: alternativeEmail?.trim() || null,
      })
      .where(eq(admins.id, current.id))

    // Log the profile update action
    await logAudit({
      category: 'admin',
      action: 'admin.profile_updated',
      target: `${name.trim()} (@${cleanUsername})`
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to update admin profile:', error)
    return { success: false, error: 'Profile transaction update failed.' }
  }
}

export async function validateInviteToken(token: string) {
  try {
    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.inviteToken, token))
      .limit(1)
      .then((rows) => rows[0])

    if (!admin) {
      return { success: false, error: 'Invalid invitation token.' }
    }

    if (admin.inviteExpiresAt && new Date() > admin.inviteExpiresAt) {
      return { success: false, error: 'This invitation token has expired.' }
    }

    return { success: true, email: admin.email, name: admin.name }
  } catch (error) {
    console.error('Failed to validate invite token:', error)
    return { success: false, error: 'Verification transaction failed.' }
  }
}

export async function setupAdminCredentials(token: string, username: string, passwordPlain: string) {
  try {
    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.inviteToken, token))
      .limit(1)
      .then((rows) => rows[0])

    if (!admin) {
      return { success: false, error: 'Invalid invitation token.' }
    }

    if (admin.inviteExpiresAt && new Date() > admin.inviteExpiresAt) {
      return { success: false, error: 'This invitation token has expired.' }
    }

    const existing = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username.trim().toLowerCase()))
      .limit(1)
      .then((rows) => rows[0])

    if (existing && existing.id !== admin.id) {
      return { success: false, error: 'Username is already taken by another administrator.' }
    }

    const hash = await bcrypt.hash(passwordPlain, 10)
    await db
      .update(admins)
      .set({
        username: username.trim().toLowerCase(),
        passwordHash: hash,
        inviteToken: null,
        inviteExpiresAt: null,
      })
      .where(eq(admins.id, admin.id))

    return { success: true }
  } catch (error) {
    console.error('Failed to complete onboarding setup:', error)
    return { success: false, error: 'Setup transaction failed.' }
  }
}

export async function toggleAdminDisabledAction(targetAdminId: string, isDisabled: boolean) {
  await ensureAdmin()
  const current = await getCurrentAdmin()
  if (!current || current.role !== 'super_admin') {
    return { success: false, error: 'Only Super Admins can toggle administrator status.' }
  }
  if (current.id === targetAdminId) {
    return { success: false, error: 'System restriction: You cannot disable your own administrative account.' }
  }
  try {
    const target = await db.query.admins.findFirst({ where: eq(admins.id, targetAdminId), columns: { name: true } })
    await db
      .update(admins)
      .set({ isDisabled })
      .where(eq(admins.id, targetAdminId))
    await logAudit({ category: 'admin', action: isDisabled ? 'admin.disabled' : 'admin.enabled', target: target?.name || targetAdminId })
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle admin status:', error)
    return { success: false, error: 'Database transaction failed.' }
  }
}

export async function resetAdminPasswordAction(targetAdminId: string, newPasswordPlain: string) {
  await ensureAdmin()
  const current = await getCurrentAdmin()
  if (!current || current.role !== 'super_admin') {
    return { success: false, error: 'Only Super Admins can reset administrative passwords.' }
  }
  if (!newPasswordPlain || newPasswordPlain.trim().length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' }
  }
  try {
    const hash = await bcrypt.hash(newPasswordPlain, 10)
    const target = await db.query.admins.findFirst({ where: eq(admins.id, targetAdminId), columns: { name: true } })
    await db
      .update(admins)
      .set({ passwordHash: hash })
      .where(eq(admins.id, targetAdminId))
    await logAudit({ category: 'admin', action: 'admin.password_reset', target: target?.name || targetAdminId })
    return { success: true }
  } catch (error) {
    console.error('Failed to reset admin password:', error)
    return { success: false, error: 'Database transaction failed.' }
  }
}

export async function changeAdminPasswordAction(oldPasswordPlain: string, newPasswordPlain: string) {
  await ensureAdmin()
  const current = await getCurrentAdmin()
  if (!current) {
    return { success: false, error: 'Session expired.' }
  }
  if (!current.passwordHash) {
    return { success: false, error: 'Administrative password hash not set.' }
  }
  if (!oldPasswordPlain || !newPasswordPlain) {
    return { success: false, error: 'Please supply both the old and new passwords.' }
  }
  if (newPasswordPlain.trim().length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' }
  }
  try {
    const matches = await bcrypt.compare(oldPasswordPlain, current.passwordHash)
    if (!matches) {
      return { success: false, error: 'Current password provided is incorrect.' }
    }
    const hash = await bcrypt.hash(newPasswordPlain, 10)
    await db
      .update(admins)
      .set({ passwordHash: hash })
      .where(eq(admins.id, current.id))

    // Log the password change action
    await logAudit({
      category: 'admin',
      action: 'admin.password_changed',
      target: current.name
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to change admin password:', error)
    return { success: false, error: 'Database transaction failed.' }
  }
}

export async function logSubscribersExportAction(count: number) {
  await ensureAdmin()
  await logAudit({
    category: 'admin',
    action: 'subscribers.export_csv',
    target: `${count} subscriber${count === 1 ? '' : 's'}`
  })
  revalidatePath('/admin')
  return { success: true }
}

// Lightweight sidebar counts – fetched once on mount for badge display
export async function getSidebarCounts() {
  await ensureAdmin()
  const admin = await getCurrentAdmin()
  if (!admin) throw new Error('Unauthorized')

  // Run each count independently so one failing query never zeros out the rest
  const countOf = async (query: ReturnType<typeof sql>): Promise<number> => {
    try {
      const res = await db.execute(query)
      return (res as any)[0]?.count ?? 0
    } catch (error) {
      console.error('Sidebar count query failed:', error)
      return 0
    }
  }

  const [
    owners,
    pendingOwners,
    developers,
    subscribers,
    adminsCount,
    enquiries,
    tables,
    pendingSqlRequests,
  ] = await Promise.all([
    countOf(sql`SELECT count(*)::int AS count FROM public.owners`),
    countOf(sql`SELECT count(*)::int AS count FROM public.users u INNER JOIN public.owners o ON u.id = o.id WHERE u.is_approved = false`),
    countOf(sql`SELECT count(*)::int AS count FROM public.developers`),
    countOf(sql`SELECT count(*)::int AS count FROM public.subscribers`),
    countOf(sql`SELECT count(*)::int AS count FROM public.admins`),
    countOf(sql`SELECT count(*)::int AS count FROM public.support_enquiries`),
    countOf(sql`SELECT count(*)::int AS count FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'r'`),
    admin.role === 'super_admin'
      ? countOf(sql`SELECT count(*)::int AS count FROM public.sql_query_requests WHERE status = 'pending'`)
      : Promise.resolve(0),
  ])

  return {
    success: true,
    counts: {
      owners,
      pendingOwners,
      developers,
      subscribers,
      admins: adminsCount,
      enquiries,
      tables,
      pendingSqlRequests,
    }
  }
}

