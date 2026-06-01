import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export let client: postgres.Sql;

if (process.env.NODE_ENV === 'production') {
  client = postgres(process.env.DATABASE_URL)
} else {
  if (!(global as any).postgresClient) {
    (global as any).postgresClient = postgres(process.env.DATABASE_URL)
  }
  client = (global as any).postgresClient
}

export const db = drizzle(client, { schema })

