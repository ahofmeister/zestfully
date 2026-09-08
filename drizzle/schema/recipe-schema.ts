import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, real, text } from "drizzle-orm/pg-core";
import type { foodSchema } from "@/drizzle/schema/food-schema";
import type { ingredientSchema } from "@/drizzle/schema/ingredient-schema";
import { id, timestamps, userId } from "@/drizzle/schema/schema-commons";

export type RecipeWithIngredients = typeof recipeSchema.$inferSelect & {
	ingredients: (typeof ingredientSchema.$inferSelect & {
		food: typeof foodSchema.$inferSelect;
	})[];
};

export type NewRecipeWithIngredients = typeof recipeSchema.$inferInsert & {
	ingredients: (typeof ingredientSchema.$inferInsert)[];
};

export const recipeSchema = pgTable(
	"recipe",
	{
		...id(),
		...timestamps(),
		...userId(),
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
).enableRLS();
