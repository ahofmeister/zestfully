import { sql } from "drizzle-orm";
import { index, pgPolicy, real, snakeCase, text, uuid } from "drizzle-orm/pg-core";
import { foodSchema } from "@/drizzle/schema/food-schema";
import { profileSchema } from "@/drizzle/schema/profile-schema";
import { recipeSchema } from "@/drizzle/schema/recipe-schema";
import { createdAt, id, updatedAt, userId } from "@/drizzle/schema/schema-commons";

export const ingredientSchema = snakeCase.table.withRLS(
	"ingredient",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		createdAt,
		userId: uuid("user_id")
			.notNull()
			.references(() => profileSchema.id, { onDelete: "cascade" })
			.default(sql`auth.uid()`),
		updatedAt,
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
);
