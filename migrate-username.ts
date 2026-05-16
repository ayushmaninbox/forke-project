import { db } from './lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    await db.execute(sql`ALTER TABLE "users" ADD COLUMN "username" text;`);
    await db.execute(sql`ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");`);
    console.log("Successfully added username column to users table.");
  } catch (error) {
    console.error("Error updating schema:", error);
  }
}

main();
