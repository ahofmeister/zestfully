DROP POLICY "users_view_own_and_public_milestones" ON "milestone" CASCADE;--> statement-breakpoint
CREATE POLICY "users_view_own_milestones" ON "milestone" AS PERMISSIVE FOR SELECT TO "authenticated" USING (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "users_view_public_milestones" ON "milestone" AS PERMISSIVE FOR SELECT TO public USING (visibility = 'public');