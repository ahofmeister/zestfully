ALTER TABLE "recipes_categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Users can manage their own recipes" ON "recipes_categories" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
    SELECT 1 FROM recipe r
    WHERE r.user_id = auth.uid() and r.id = recipe_id 
  )) WITH CHECK (EXISTS (
    SELECT 1 FROM recipe r
    WHERE r.user_id = auth.uid() and r.id = recipe_id 
  ));