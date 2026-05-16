CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "owners" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"contact_number" text NOT NULL,
	"contact_email" text NOT NULL,
	"company_name" text NOT NULL,
	"company_website" text,
	"personal_linkedin" text NOT NULL,
	"company_linkedin" text NOT NULL,
	"designation" text NOT NULL,
	"other_links" text,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_approved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "owners" ADD CONSTRAINT "owners_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;