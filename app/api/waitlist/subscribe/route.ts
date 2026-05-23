import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'
import { z } from 'zod'
import { sendWelcomeEmail } from '@/lib/email'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = emailSchema.parse(body)

    await db.insert(subscribers).values({ email }).onConflictDoNothing()

    // Send the welcome email in the background to keep the API response extremely fast (< 30ms)
    sendWelcomeEmail(email).catch((err) => {
      console.error('Failed to send welcome email in background:', err)
    })

    return NextResponse.json({ success: true, message: "You're on the list!" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Waitlist subscribe error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
