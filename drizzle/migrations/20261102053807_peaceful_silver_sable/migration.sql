CREATE TABLE "note" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"text" text,
	"date" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "note" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "note_user_id_idx" ON "note" ("user_id");--> statement-breakpoint
CREATE POLICY "users_manage_own_notes" ON "note" AS PERMISSIVE FOR ALL TO "authenticated" USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));