ALTER TYPE "public"."task_status" ADD VALUE 'processing' BEFORE 'open';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "sandbox_repo_id" uuid;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "source_repo" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_sandbox_repo_id_sandbox_repos_id_fk" FOREIGN KEY ("sandbox_repo_id") REFERENCES "public"."sandbox_repos"("id") ON DELETE set null ON UPDATE no action;