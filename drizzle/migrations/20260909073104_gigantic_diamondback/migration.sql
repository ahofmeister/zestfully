CREATE TABLE "recipes_categories" (
	"recipe_id" uuid,
	"category_id" uuid,
	CONSTRAINT "recipes_categories_pkey" PRIMARY KEY("recipe_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "recipe-category" ALTER COLUMN "user_id" SET DEFAULT auth
      .
      uid
      ();--> statement-breakpoint
ALTER TABLE "recipes_categories" ADD CONSTRAINT "recipes_categories_recipe_id_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id");--> statement-breakpoint
ALTER TABLE "recipes_categories" ADD CONSTRAINT "recipes_categories_category_id_recipe-category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "recipe-category"("id");--> statement-breakpoint