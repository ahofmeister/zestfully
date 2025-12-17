CREATE TABLE "habit_completions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"habit_id" uuid NOT NULL,
	"completed_at" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "habit_completion_unique" UNIQUE("habit_id","completed_at")
);
--> statement-breakpoint
ALTER TABLE "habit_completions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "habit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"frequency_type" text DEFAULT 'daily' NOT NULL,
	"frequency_target" integer,
	"frequency_days" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "habit" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "food" ALTER COLUMN "energy" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "food" ALTER COLUMN "protein" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "food" ALTER COLUMN "fat" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "food" ALTER COLUMN "carbohydrates" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "meal_items" ALTER COLUMN "user_id" SET DEFAULT auth
        .
        uid
        ();--> statement-breakpoint
ALTER TABLE "meal_items" ALTER COLUMN "quantity" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "habit_completions" ADD CONSTRAINT "habit_completions_habit_id_habit_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habit"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "habit_completions_habit_id_idx" ON "habit_completions" USING btree ("habit_id");--> statement-breakpoint
CREATE INDEX "habit_completions_completed_at_idx" ON "habit_completions" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "habits_user_id_idx" ON "habit" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "habits_user_created_idx" ON "habit" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE POLICY "users_view_own_completions" ON "habit_completions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM habit 
        WHERE habit.id = habit_id 
        AND habit.user_id = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "users_insert_own_completions" ON "habit_completions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM habit 
        WHERE habit.id = habit_id 
        AND habit.user_id = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "users_delete_own_completions" ON "habit_completions" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM habit 
        WHERE habit.id = habit_id 
        AND habit.user_id = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "users_view_own_habits" ON "habit" AS PERMISSIVE FOR SELECT TO "authenticated" USING (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "users_insert_own_habits" ON "habit" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "users_update_own_habits" ON "habit" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "users_delete_own_habits" ON "habit" AS PERMISSIVE FOR DELETE TO "authenticated" USING (auth.uid() = user_id);--> statement-breakpoint
DROP TYPE "public"."MealTime";--> statement-breakpoint
DROP TYPE "public"."measurement";