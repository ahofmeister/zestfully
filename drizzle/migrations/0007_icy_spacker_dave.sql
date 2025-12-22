ALTER TABLE "spark" RENAME COLUMN "profile_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "spark" DROP CONSTRAINT "spark_profile_habit_unique";--> statement-breakpoint
ALTER TABLE "spark" DROP CONSTRAINT "spark_profile_id_profile_id_fk";
--> statement-breakpoint
DROP INDEX "spark_profile_id_idx";--> statement-breakpoint
CREATE INDEX "spark_user_id_idx" ON "spark" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "spark" ADD CONSTRAINT "spark_user_habit_unique" UNIQUE("habit_id","user_id");--> statement-breakpoint


-- Instead of ALTER POLICY
DROP POLICY IF EXISTS "users_insert_own_sparks" ON "spark";
CREATE POLICY "users_insert_own_sparks" ON "spark"
  AS PERMISSIVE FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_view_all_sparks" ON "spark";
CREATE POLICY "users_view_all_sparks" ON "spark"
  AS PERMISSIVE FOR SELECT
                                                TO public
                                                USING (true);

DROP POLICY IF EXISTS "users_delete_own_sparks" ON "spark";
CREATE POLICY "users_delete_own_sparks" ON "spark"
  AS PERMISSIVE FOR DELETE
TO authenticated
  USING (user_id = auth.uid());