import { sql } from "drizzle-orm";
import { date, pgPolicy, real, snakeCase, text, uuid } from "drizzle-orm/pg-core";
import { foodSchema } from "@/drizzle/schema/food-schema";
import { profileSchema } from "@/drizzle/schema/profile-schema";
import { createdAt, id, updatedAt, userId } from "@/drizzle/schema/schema-commons";

export const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
export type MealType = (typeof mealTypes)[number];

export type MealItemWithFood = typeof mealItemSchema.$inferSelect & {
	food: typeof foodSchema.$inferSelect;
};

export const mealItemSchema = snakeCase.table.withRLS(
	"meal_item",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		createdAt,
		updatedAt,
		userId: uuid("user_id")
			.notNull()
			.references(() => profileSchema.id, { onDelete: "cascade" })
			.default(sql`auth.uid()`),
		foodId: uuid("food_id")
			.notNull()
			.references(() => foodSchema.id),
		date: date().notNull(),
		mealType: text("meal_type").$type<MealType>().notNull(),
		quantity: real().notNull(),
		unit: text(),
	},
	(_table) => [
		pgPolicy("Authenticated users can insert their own food", {
			as: "permissive",
			for: "insert",
			to: ["authenticated"],
			withCheck: sql`(auth.uid() = user_id)`,
		}),
		pgPolicy("Enable delete for users based on user_id", {
			as: "permissive",
			for: "delete",
			to: ["public"],
		}),
		pgPolicy("User can only select their own foods", {
			as: "permissive",
			for: "select",
			to: ["authenticated"],
		}),
	],
);
