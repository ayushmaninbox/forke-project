-- Safely drop old admins table and recreate it with the updated invitation schema
DROP TABLE IF EXISTS "admins" CASCADE;

CREATE TABLE "admins" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "username" text UNIQUE,
  "password_hash" text,
  "role" text DEFAULT 'admin' NOT NULL,
  "alternative_email" text,
  "invite_token" text UNIQUE,
  "invite_expires_at" timestamp,
  "is_disabled" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
