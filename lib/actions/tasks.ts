'use server'

import { tasks, users, submissions, revisionRequests } from '@/lib/db/schema'
import { createTaskSchema } from '@/lib/validations/task'
import { getTaskById } from '@/lib/db/queries/tasks'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { getRequiredLevel } from '@/lib/utils/tasks'
import { z } from 'zod'

export type CreateTaskState = {
  errors?: {
    title?: string[]
    description?: string[]
    budget?: string[]
    deadline?: string[]
    skillTags?: string[]
  }
  message?: string | null
}

export type SubmitWorkState = {
  errors?: {
    githubLink?: string[]
    note?: string[]
  }
  message?: string | null
  submittedAt?: Date
  githubLink?: string
  error?: string
  success?: boolean
}

export async function createTask(prevState: CreateTaskState, formData: FormData): Promise<CreateTaskState> {
  const session = await auth()
  const user = session?.user as { id: string; role: 'developer' | 'client' } | undefined

  if (!user || user.role !== 'client') {
    return { message: 'Unauthorized: Only clients can post tasks.' }
  }

  const rawDeadline = formData.get('deadline')
  const skillTags = formData.getAll('skillTags')
  
  const validatedFields = createTaskSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    budget: Number(formData.get('budget')) * 100, // Convert INR to Paise
    deadline: rawDeadline ? new Date(rawDeadline.toString()) : null,
    skillTags: skillTags.length > 0 ? skillTags : [],
  })

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors
    return {
      errors: {
        title: fieldErrors.title,
        description: fieldErrors.description,
        budget: fieldErrors.budget,
        deadline: fieldErrors.deadline,
        skillTags: fieldErrors.skillTags,
      },
      message: 'Validation failed. Please check the fields.',
    }
  }

  const { title, description, budget, deadline, skillTags: validatedTags } = validatedFields.data

  try {
    await db.insert(tasks).values({
      title,
      description,
      budget,
      skillTags: validatedTags,
      deadline: deadline || null,
      clientId: user.id,
      status: 'open',
    })
  } catch (error) {
    console.error('Database Error:', error)
    return { message: 'Something went wrong while posting the task. Please try again.' }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?success=task-posted')
}

export async function claimTask(taskId: string) {
  const session = await auth()
  const user = session?.user as { id: string; role: 'developer' | 'client'; level: number } | undefined

  if (!user || user.role !== 'developer') {
    throw new Error('Unauthorized: Only developers can claim tasks.')
  }

  // Get task to check level requirements
  const taskResult = await getTaskById(taskId)
  if (!taskResult) throw new Error('Task not found.')
  
  if (taskResult.task.status !== 'open') {
    throw new Error('This task has already been claimed.')
  }

  const requiredLevel = getRequiredLevel(taskResult.task.budget)
  if ((user.level || 1) < requiredLevel) {
    throw new Error(`Insufficient Level: You need to be LVL ${requiredLevel} to claim this task.`)
  }

  // Perform atomic update to handle race conditions
  const updated = await db
    .update(tasks)
    .set({
      status: 'claimed',
      claimantId: user.id,
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.status, 'open')))
    .returning()

  if (updated.length === 0) {
    throw new Error('Task was just claimed by someone else! Try another one.')
  }

  revalidatePath('/tasks')
  revalidatePath(`/tasks/${taskId}`)
  redirect(`/tasks/${taskId}`)
}

export async function submitWork(prevState: SubmitWorkState | null, formData: FormData): Promise<SubmitWorkState> {
  const session = await auth()
  const user = session?.user as { id: string; role: 'developer' | 'client' } | undefined
  const taskId = formData.get('taskId') as string
  const githubLink = formData.get('githubLink') as string
  const note = formData.get('note') as string

  if (!user || user.role !== 'developer') {
    return { error: 'Unauthorized.' }
  }

  // Validate URL
  const urlSchema = z.string().url().startsWith('https://')
  const validation = urlSchema.safeParse(githubLink)
  if (!validation.success) {
    return { error: 'Invalid URL. Must start with https://' }
  }

  const taskResult = await getTaskById(taskId)
  if (!taskResult) return { error: 'Task not found.' }
  if (taskResult.task.status !== 'claimed') return { error: 'Task is not in claimed state.' }
  if (taskResult.task.claimantId !== user.id) return { error: 'You are not the claimant.' }

  try {
    await db.transaction(async (tx) => {
      await tx.insert(submissions).values({
        taskId,
        developerId: user.id,
        githubLink,
        note: note || null,
        status: 'pending',
      })

      await tx
        .update(tasks)
        .set({ status: 'submitted' })
        .where(eq(tasks.id, taskId))
    })
  } catch (error) {
    console.error('Submission Error:', error)
    return { error: 'Failed to submit work.' }
  }

  revalidatePath(`/tasks/${taskId}`)
  revalidatePath('/dashboard')
  return { success: true, submittedAt: new Date(), githubLink }
}

export async function approveSubmission(taskId: string) {
  const session = await auth()
  const user = session?.user as { id: string; role: 'developer' | 'client' } | undefined

  if (!user || user.role !== 'client') {
    throw new Error('Unauthorized.')
  }

  const taskResult = await getTaskById(taskId)
  if (!taskResult || taskResult.task.clientId !== user.id) {
    throw new Error('Task not found or unauthorized.')
  }

  if (taskResult.task.status !== 'submitted') {
    throw new Error('Task is not in submitted state.')
  }

  const developerId = taskResult.task.claimantId!

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(submissions)
        .set({ status: 'approved' })
        .where(and(eq(submissions.taskId, taskId), eq(submissions.status, 'pending')))

      await tx
        .update(tasks)
        .set({ status: 'approved' })
        .where(eq(tasks.id, taskId))

      const devResult = await tx.select().from(users).where(eq(users.id, developerId)).limit(1)
      if (devResult.length > 0) {
        const dev = devResult[0]
        const newXp = dev.xp + 100
        let newLevel = dev.level
        if (newXp >= dev.level * 500) {
          newLevel += 1
        }
        await tx.update(users).set({ xp: newXp, level: newLevel }).where(eq(users.id, developerId))
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to approve submission.'
    console.error('Approval Error:', error)
    throw new Error(message)
  }

  revalidatePath('/dashboard')
  revalidatePath(`/tasks/${taskId}`)
}

export async function requestRevision(taskId: string, revisionNote: string) {
  const session = await auth()
  const user = session?.user as { id: string; role: 'developer' | 'client' } | undefined

  if (!user || user.role !== 'client') {
    throw new Error('Unauthorized.')
  }

  if (!revisionNote) throw new Error('Revision note is required.')

  const taskResult = await getTaskById(taskId)
  if (!taskResult || taskResult.task.clientId !== user.id) {
    throw new Error('Task not found or unauthorized.')
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(submissions)
        .set({ status: 'rejected' })
        .where(and(eq(submissions.taskId, taskId), eq(submissions.status, 'pending')))

      await tx
        .update(tasks)
        .set({ status: 'claimed' })
        .where(eq(tasks.id, taskId))

      await tx.insert(revisionRequests).values({
        taskId,
        clientNote: revisionNote,
      })
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to request revision.'
    console.error('Revision Error:', error)
    throw new Error(message)
  }

  revalidatePath('/dashboard')
  revalidatePath(`/tasks/${taskId}`)
}
