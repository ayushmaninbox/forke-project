CREATE TABLE "ai_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"developer_fork_id" uuid,
	"sandbox_repo_id" uuid,
	"pr_number" integer,
	"verdict" text NOT NULL,
	"score" integer NOT NULL,
	"requirement_match" text NOT NULL,
	"summary" text NOT NULL,
	"strengths" text,
	"issues" text,
	"risks" text,
	"unauthorized_edits" text,
	"resolved_issues" text,
	"resolved_risks" text,
	"risk_score" integer,
	"risk_routing" text,
	"model" text,
	"tokens_used" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "baseline_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sandbox_repo_id" uuid NOT NULL,
	"branch" text NOT NULL,
	"commit_sha" text NOT NULL,
	"tech_stack" text,
	"results" text,
	"ai_summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "developer_forks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_username" text NOT NULL,
	"sandbox_repo" text NOT NULL,
	"fork_url" text NOT NULL,
	"pr_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pr_number" integer NOT NULL,
	"sandbox_repo_id" uuid NOT NULL,
	"commit_sha" text NOT NULL,
	"baseline_snapshot_id" uuid,
	"results" text NOT NULL,
	"comparison" text NOT NULL,
	"verdict" text NOT NULL,
	"report_html" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sandbox_developers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_id" integer NOT NULL,
	"username" text NOT NULL,
	"access_token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sandbox_developers_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
CREATE TABLE "sandbox_owners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_id" integer NOT NULL,
	"username" text NOT NULL,
	"access_token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sandbox_owners_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
CREATE TABLE "sandbox_repos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"source_repo" text NOT NULL,
	"sandbox_repo" text NOT NULL,
	"task_title" text,
	"task_description" text,
	"frontend_stack" text,
	"backend_stack" text,
	"allowed_paths" text,
	"restricted_paths" text,
	"acceptance_criteria" text,
	"verification_status" text DEFAULT 'verifying' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscribers" ADD COLUMN IF NOT EXISTS "source" text DEFAULT 'direct' NOT NULL;--> statement-breakpoint
ALTER TABLE "subscribers" ADD COLUMN IF NOT EXISTS "attribution" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "attribution" jsonb;--> statement-breakpoint
ALTER TABLE "ai_reviews" ADD CONSTRAINT "ai_reviews_developer_fork_id_developer_forks_id_fk" FOREIGN KEY ("developer_fork_id") REFERENCES "public"."developer_forks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_reviews" ADD CONSTRAINT "ai_reviews_sandbox_repo_id_sandbox_repos_id_fk" FOREIGN KEY ("sandbox_repo_id") REFERENCES "public"."sandbox_repos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "baseline_snapshots" ADD CONSTRAINT "baseline_snapshots_sandbox_repo_id_sandbox_repos_id_fk" FOREIGN KEY ("sandbox_repo_id") REFERENCES "public"."sandbox_repos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_results" ADD CONSTRAINT "review_results_sandbox_repo_id_sandbox_repos_id_fk" FOREIGN KEY ("sandbox_repo_id") REFERENCES "public"."sandbox_repos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_results" ADD CONSTRAINT "review_results_baseline_snapshot_id_baseline_snapshots_id_fk" FOREIGN KEY ("baseline_snapshot_id") REFERENCES "public"."baseline_snapshots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sandbox_repos" ADD CONSTRAINT "sandbox_repos_owner_id_sandbox_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."sandbox_owners"("id") ON DELETE cascade ON UPDATE no action;