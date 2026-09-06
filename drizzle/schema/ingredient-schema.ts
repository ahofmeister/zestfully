import { sql } from "drizzle-orm";
import { index, pgPolicy, pgTable, real, text, uuid } from "drizzle-orm/pg-core";
import { foodSchema } from "@/drizzle/schema/food-schema";
import { recipeSchema } from "@/drizzle/schema/recipe-schema";
import { id, timestamps, userId } from "@/drizzle/schema/schema-commons";

export const ingredientSchema = pgTable(
	"ingredient",
	{
		...id(),
		...timestamps(),
		...userId(),
		foodId: uuid("food_id")
			.notNull()
			.references(() => foodSchema.id),
		recipeId: uuid("recipe_id")
			.notNull()
			.references(() => recipeSchema.id, { onDelete: "cascade" }),
		quantity: real().notNull(),
		unit: text().notNull(),
	},
	(_table) => [
		index("recipe_ingredient_user_food_idx").on(_table.userId, _table.foodId),
		pgPolicy("Users can manage their own recipe ingredients", {
			as: "permissive",
			for: "all",
			to: ["authenticated"],
			using: sql`(auth.uid() = user_id)`,
			withCheck: sql`(auth.uid() = user_id)`,
		}),
	],
).enableRLS();
