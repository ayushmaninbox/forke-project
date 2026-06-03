'use server'

import { db } from './db'
import { users, owners } from './db/schema'
import { auth } from '@/auth'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { logAudit } from './actions/audit-actions'

export async function submitOwnerApplication(formData: any) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const userId = session.user.id

  try {
    // 1. Verify user isn't already a developer
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId)
    })

    if (existingUser?.role === 'developer') {
      return { success: false, error: 'Cannot register a Developer account as an Owner.' }
    }

    // 2. Update user role and status
    await db.update(users).set({
      role: 'owner',
      isApproved: false
    }).where(eq(users.id, userId))

    // 2. Save application data to owners table
    await db.insert(owners).values({
      id: userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      contactNumber: formData.contactNumber,
      contactEmail: formData.contactEmail,
      companyName: formData.companyName,
      companyWebsite: formData.companyWebsite || null,
      personalLinkedIn: formData.personalLinkedIn,
      companyLinkedIn: formData.companyLinkedIn,
      designation: formData.designation,
      otherLinks: formData.otherLinks || null,
      message: formData.message || null,
    }).onConflictDoUpdate({
      target: owners.id,
      set: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        contactEmail: formData.contactEmail,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite || null,
        personalLinkedIn: formData.personalLinkedIn,
        companyLinkedIn: formData.companyLinkedIn,
        designation: formData.designation,
        otherLinks: formData.otherLinks || null,
        message: formData.message || null,
      }
    })

    revalidatePath('/dashboard')

    // Log the event explicitly for the activity feed
    await logAudit({
      category: 'owner',
      action: 'owner.applied',
      target: `${formData.firstName} ${formData.lastName}`,
      actorId: userId,
      actorName: `${formData.firstName} ${formData.lastName}`
    })

    return { success: true }
  } catch (error: any) {
    console.error('FULL SUBMISSION ERROR:', error)
    return { success: false, error: 'Failed to submit application. Please try again or contact support.' }
  }
}
