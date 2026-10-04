CREATE TABLE "recipe-category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"name" text NOT NULL,
	"color" text
);
--> statement-breakpoint
ALTER TABLE "recipe-category" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
--> statement-breakpoint
ALTER TABLE "recipe" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "recipe-category" ADD CONSTRAINT "recipe-category_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_item" ADD CONSTRAINT "meal_item_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_category_id_recipe-category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."recipe-category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Users can manage their own recipe categories" ON "recipe-category" AS PERMISSIVE FOR ALL TO "authenticated" USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));