CREATE TABLE "milestone" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" text DEFAULT '#10b981' NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"start_date" timestamp NOT NULL,
	"reset_at" timestamp,
	"reset_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "milestone" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "milestones_user_id_idx" ON "milestone" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "milestones_visibility_idx" ON "milestone" USING btree ("visibility");--> statement-breakpoint
CREATE POLICY "users_view_own_and_public_milestones" ON "milestone" AS PERMISSIVE FOR SELECT TO "authenticated" USING (user_id = auth.uid() OR visibility IN ('public'));--> statement-breakpoint
CREATE POLICY "users_insert_own_milestones" ON "milestone" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "users_update_own_milestones" ON "milestone" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "users_delete_own_milestones" ON "milestone" AS PERMISSIVE FOR DELETE TO "authenticated" USING (user_id = auth.uid());