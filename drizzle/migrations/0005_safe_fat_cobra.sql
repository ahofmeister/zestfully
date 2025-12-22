CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"username" text NOT NULL,
	"bio" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "profile_username_unique" UNIQUE("username"),
	CONSTRAINT "username_length" CHECK (char_length("profile"."username") >= 3 AND char_length("profile"."username") <= 20),
	CONSTRAINT "username_format" CHECK ("profile"."username" ~ '^[a-zA-Z0-9_-]+$'),
	CONSTRAINT "bio_length" CHECK ("profile"."bio" IS NULL OR char_length("profile"."bio") <= 200)
);
--> statement-breakpoint
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "spark" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"habit_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "spark_profile_habit_unique" UNIQUE("habit_id","profile_id")
);
--> statement-breakpoint
ALTER TABLE "spark" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "habit" ADD COLUMN "visibility" text DEFAULT 'private' NOT NULL;--> statement-breakpoint
ALTER TABLE "spark" ADD CONSTRAINT "spark_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spark" ADD CONSTRAINT "spark_habit_id_habit_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habit"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profile_username_idx" ON "profile" USING btree ("username");--> statement-breakpoint
CREATE INDEX "profile_user_id_idx" ON "profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "spark_habit_id_idx" ON "spark" USING btree ("habit_id");--> statement-breakpoint
CREATE INDEX "spark_profile_id_idx" ON "spark" USING btree ("profile_id");--> statement-breakpoint
CREATE POLICY "users_view_public_completions" ON "habit_completions" AS PERMISSIVE FOR SELECT TO public USING (EXISTS (
    SELECT 1 FROM habit 
    WHERE habit.id = habit_id 
    AND habit.visibility = 'public'
  ));--> statement-breakpoint
CREATE POLICY "members_view_member_completions" ON "habit_completions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
    SELECT 1 FROM habit 
    WHERE habit.id = habit_id 
    AND habit.visibility = 'members'
  ));--> statement-breakpoint
CREATE POLICY "users_view_public_habits" ON "habit" AS PERMISSIVE FOR SELECT TO public USING (visibility = 'public');--> statement-breakpoint
CREATE POLICY "members_view_member_habits" ON "habit" AS PERMISSIVE FOR SELECT TO "authenticated" USING (visibility = 'members');--> statement-breakpoint
CREATE POLICY "users_view_own_profile" ON "profile" AS PERMISSIVE FOR SELECT TO "authenticated" USING (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "users_view_public_profiles" ON "profile" AS PERMISSIVE FOR SELECT TO public USING (is_public = true);--> statement-breakpoint
CREATE POLICY "users_update_own_profile" ON "profile" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "users_insert_own_sparks" ON "spark" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM profile 
        WHERE profile.id = profile_id 
        AND profile.user_id = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "users_view_all_sparks" ON "spark" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "users_delete_own_sparks" ON "spark" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM profile 
        WHERE profile.id = profile_id 
        AND profile.user_id = auth.uid()
      ));--> statement-breakpoint
ALTER POLICY "users_view_own_completions" ON "habit_completions" TO authenticated USING (EXISTS (
    SELECT 1 FROM habit 
    WHERE habit.id = habit_id 
    AND habit.user_id = auth.uid()
  ));--> statement-breakpoint
ALTER POLICY "users_insert_own_completions" ON "habit_completions" TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM habit 
    WHERE habit.id = habit_id 
    AND habit.user_id = auth.uid()
  ));--> statement-breakpoint
ALTER POLICY "users_delete_own_completions" ON "habit_completions" TO authenticated USING (EXISTS (
    SELECT 1 FROM habit 
    WHERE habit.id = habit_id 
    AND habit.user_id = auth.uid()
  ));--> statement-breakpoint
ALTER POLICY "users_view_own_habits" ON "habit" TO authenticated USING (user_id = auth.uid());--> statement-breakpoint
ALTER POLICY "users_insert_own_habits" ON "habit" TO authenticated WITH CHECK (user_id = auth.uid());--> statement-breakpoint
ALTER POLICY "users_update_own_habits" ON "habit" TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());--> statement-breakpoint
ALTER POLICY "users_delete_own_habits" ON "habit" TO authenticated USING (user_id = auth.uid());