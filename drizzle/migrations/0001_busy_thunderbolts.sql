CREATE TABLE "meal_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"food_id" uuid NOT NULL,
	"date" date NOT NULL,
	"meal_type" varchar(20) NOT NULL,
	"quantity" numeric(8, 2) NOT NULL,
	"unit" varchar(20) DEFAULT 'g' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quantity_positive" CHECK ("meal_items"."quantity" > 0)
);
--> statement-breakpoint
ALTER TABLE "meal_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "food" DROP CONSTRAINT "foods_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "food" ALTER COLUMN "created_at" SET DEFAULT timezone
        ('utc'::text, now());--> statement-breakpoint
ALTER TABLE "food" ALTER COLUMN "user_id" SET DEFAULT auth
        .
        uid
        ();--> statement-breakpoint
ALTER TABLE "meal_items" ADD CONSTRAINT "meal_items_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "meal_items_date_idx" ON "meal_items" USING btree ("date");--> statement-breakpoint
CREATE INDEX "meal_items_user_id_idx" ON "meal_items" USING btree ("user_id");--> statement-breakpoint
CREATE POLICY "Users can view own meal items" ON "meal_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING (auth.uid() = "meal_items"."user_id");--> statement-breakpoint
CREATE POLICY "Users can insert own meal items" ON "meal_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() ="meal_items"."user_id");--> statement-breakpoint
ALTER POLICY "Authenticated users can insert their own food" ON "food" TO authenticated WITH CHECK ((auth.uid()
                     = user_id));