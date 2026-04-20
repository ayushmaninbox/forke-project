import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['developer', 'client'])
export const taskStatusEnum = pgEnum('task_status', [
  'open',
  'claimed',
  'submitted',
  'approved',
  'disputed',
])
export const submissionStatusEnum = pgEnum('submission_status', [
  'pending',
  'approved',
  'rejected',
])
export const escrowStatusEnum = pgEnum('escrow_status', [
  'held',
  'released',
  'refunded',
])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  passwordHash: text('password_hash'),
  role: userRoleEnum('role').default('developer').notNull(),
  level: integer('level').default(1).notNull(),
  xp: integer('xp').default(0).notNull(),
  githubUrl: text('github_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<'oauth' | 'oidc' | 'email'>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: {
      columns: [account.provider, account.providerAccountId],
      primaryKey: true,
    },
  })
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: {
      columns: [vt.identifier, vt.token],
      primaryKey: true,
    },
  })
)

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  budget: integer('budget').notNull(), // Stored in paise
  currency: text('currency').default('INR').notNull(),
  status: taskStatusEnum('status').default('open').notNull(),
  skillTags: text('skill_tags').array(),
  clientId: uuid('client_id')
    .references(() => users.id)
    .notNull(),
  claimantId: uuid('claimant_id').references(() => users.id),
  deadline: timestamp('deadline'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id')
    .references(() => tasks.id)
    .notNull(),
  developerId: uuid('developer_id')
    .references(() => users.id)
    .notNull(),
  githubLink: text('github_link').notNull(),
  note: text('note'),
  status: submissionStatusEnum('status').default('pending').notNull(),
  rating: integer('rating'), // 1-5 scale
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const escrow = pgTable('escrow', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id')
    .references(() => tasks.id)
    .unique()
    .notNull(),
  amount: integer('amount').notNull(),
  status: escrowStatusEnum('status').default('held').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const revisionRequests = pgTable('revision_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id')
    .references(() => tasks.id)
    .notNull(),
  clientNote: text('client_note').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
