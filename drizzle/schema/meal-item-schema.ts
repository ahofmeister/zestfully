import { sql } from "drizzle-orm";
import { date, pgPolicy, pgTable, real, text, uuid } from "drizzle-orm/pg-core";
import { foodSchema } from "@/drizzle/schema/food-schema";
import { id, timestamps, userId } from "@/drizzle/schema/schema-commons";

export const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
export type MealType = (typeof mealTypes)[number];

export type MealItemWithFood = typeof mealItemSchema.$inferSelect & {
	food: typeof foodSchema.$inferSelect;
};

export const mealItemSchema = pgTable(
	"meal_item",
	{
		...id(),
		...timestamps(),
		...userId(),
		foodId: uuid("food_id")
			.notNull()
			.references(() => foodSchema.id, { onDelete: "cascade" }),
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
