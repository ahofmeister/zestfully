import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, primaryKey, real, snakeCase, text, uuid } from "drizzle-orm/pg-core";
import type { foodSchema } from "@/drizzle/schema/food-schema";
import type { ingredientSchema } from "@/drizzle/schema/ingredient-schema";
import { profileSchema } from "@/drizzle/schema/profile-schema";
import { recipeCategorySchema } from "@/drizzle/schema/recipe-category-schema";
import { createdAt, updatedAt } from "@/drizzle/schema/schema-commons";

export type RecipeWithIngredients = typeof recipeSchema.$inferSelect & {
	ingredients: (typeof ingredientSchema.$inferSelect & {
		food: typeof foodSchema.$inferSelect;
	})[];
};

export type NewRecipeWithIngredients = typeof recipeSchema.$inferInsert & {
	ingredients: (typeof ingredientSchema.$inferInsert)[];
};

export const recipeSchema = snakeCase.table.withRLS(
	"recipe",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		createdAt,
		updatedAt,
		userId: uuid("user_id")
			.notNull()
			.references(() => profileSchema.id, { onDelete: "cascade" })
			.default(sql`auth.uid()`),
		name: text().notNull(),
		instructions: text(),
		servings: real().notNull().default(1),
	},
	(_table) => [
		pgPolicy("Users can manage their own recipes", {
			as: "permissive",
			for: "all",
			to: ["authenticated"],
			using: sql`(auth.uid() = user_id)`,
			withCheck: sql`(auth.uid() = user_id)`,
		}),
	],
);

export const recipeToCategoriesSchema = pgTable(
	"recipes_categories",
	{
		recipeId: uuid("recipe_id")
			.notNull()
			.references(() => recipeSchema.id),
		categoryId: uuid("category_id")
			.notNull()
			.references(() => recipeCategorySchema.id),
	},
	(table) => [
		primaryKey({ columns: [table.recipeId, table.categoryId] }),
		pgPolicy("Users can manage their own recipes", {
			as: "permissive",
			for: "all",
			to: ["authenticated"],
			using: sql`EXISTS (
    SELECT 1 FROM recipe r
    WHERE r.user_id = auth.uid() and r.id = recipe_id 
  )`,
			withCheck: sql`EXISTS (
    SELECT 1 FROM recipe r
    WHERE r.user_id = auth.uid() and r.id = recipe_id 
  )`,
		}),
	],
);
