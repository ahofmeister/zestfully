import { relations } from "drizzle-orm";
import { food, mealItems } from "@/drizzle/schema";

export const mealItemsRelations = relations(mealItems, ({ one }) => ({
	food: one(food, {
		fields: [mealItems.foodId],
		references: [food.id],
	}),
}));
