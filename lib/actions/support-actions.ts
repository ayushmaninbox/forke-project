'use server'

import { db } from '@/lib/db'
import { supportEnquiries } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function submitEnquiry(formData: any) {
  const { firstName, lastName, contactNumber, contactEmail, message, relevantLinks, errorType } = formData

  if (!firstName || !lastName || !contactNumber || !contactEmail || !message) {
    return { success: false, error: 'Please fill out all required fields.' }
  }

  try {
    await db.insert(supportEnquiries).values({
      firstName,
      lastName,
      contactNumber,
      contactEmail,
      message,
      relevantLinks: relevantLinks || null,
      errorType: errorType || null,
    })

    return { success: true }
  } catch (error) {
    console.error('Error submitting enquiry:', error)
    return { success: false, error: 'Failed to submit enquiry. Please try again later.' }
  }
}

export async function getEnquiries() {
  try {
    const data = await db.query.supportEnquiries.findMany({
      orderBy: [desc(supportEnquiries.createdAt)],
    })
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    return { success: false, error: 'Failed to fetch enquiries.' }
  }
}
