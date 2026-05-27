'use server'

import { db } from './db'
import { users, owners, subscribers } from './db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { sendBroadcastEmail } from './email'
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

import { isWaitlistEnabled, setWaitlistEnabled } from './db/settings'

export async function getWaitlistConfig() {
  await ensureAdmin()
  const enabled = await isWaitlistEnabled()
  return { enabled }
}

export async function updateWaitlistConfig(enabled: boolean) {
  await ensureAdmin()
  await setWaitlistEnabled(enabled)
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
    await db.delete(subscribers).where(eq(subscribers.id, id))
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete subscriber:', error)
    return { success: false, error: 'Database deletion failed' }
  }
}

export async function broadcastEmail(subject: string, content: string) {
  await ensureAdmin()
  try {
    const rows = await db.select({ email: subscribers.email }).from(subscribers)
    const emails = rows.map((r) => r.email)

    if (emails.length === 0) {
      return { success: false, error: 'No subscribers found' }
    }

    const wrappedHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="dark only">
        <title>${subject}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#050508;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050508;">
          <tr>
            <td align="center" style="padding:48px 16px;">
              <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background-color:#0A0A10;border:1px solid rgba(255,122,0,0.15);border-radius:24px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,0.85);">
                <tr>
                  <td align="center" style="padding:0;line-height:0;font-size:0;">
                    <img src="https://forke.space/forke-assets/banner.png" alt="Forke Banner" width="580" style="width:100%;max-width:580px;height:auto;display:block;border-bottom:1px solid rgba(255,122,0,0.05);" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:48px 40px;text-align:left;color:#ffffff;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                      <tr>
                        <td>
                          <img src="https://forke.space/forke-assets/forke_logo.png" alt="Forke Logo" width="80" style="width:80px;height:auto;display:block;" />
                        </td>
                      </tr>
                    </table>
                    <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:normal;font-style:italic;line-height:1.3;color:#ffffff;margin:0 0 20px 0;">
                      ${subject}
                    </h1>
                    <div style="font-size:14px;line-height:1.75;color:#a0a0ab;font-weight:300;">
                      ${content.replace(/\n/g, '<br>')}
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:40px;margin-bottom:24px;">
                      <tr>
                        <td style="height:1px;background-color:#1a1a24;font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                    <p style="font-family:Georgia,serif;font-size:14px;color:#555562;margin:0 0 16px 0;text-align:center;">
                      See you on the other side! <span style="color:#FF7A00;font-size:16px;font-weight:bold;line-height:1;vertical-align:middle;display:inline-block;">♥</span>
                    </p>
                    <p style="font-size:9px;color:#40404a;font-weight:700;text-transform:uppercase;letter-spacing:0.25em;margin:0;text-align:center;">
                      &copy; 2026 FORKE &middot; REAL CODE &middot; REAL REWARDS
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `
    const result = await sendBroadcastEmail(emails, subject, wrappedHtml)
    return { success: result.success, sentCount: result.sentCount }
  } catch (error) {
    console.error('Failed to broadcast email:', error)
    return { success: false, error: 'Broadcast failed' }
  }
}
