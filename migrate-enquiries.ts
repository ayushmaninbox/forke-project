import { db } from './lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "support_enquiries" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "first_name" text NOT NULL,
        "last_name" text NOT NULL,
        "contact_number" text NOT NULL,
        "contact_email" text NOT NULL,
        "message" text NOT NULL,
        "relevant_links" text,
        "error_type" text,
        "status" text NOT NULL DEFAULT 'pending',
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `);
    console.log("Successfully created support_enquiries table.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

main();
