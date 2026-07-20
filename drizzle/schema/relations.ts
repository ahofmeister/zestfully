import { relations } from "drizzle-orm";
import { foodSchema } from "@/drizzle/schema/food-schema";
import { mealItemSchema } from "@/drizzle/schema/meal-item-schema";
import { profileSchema } from "@/drizzle/schema/profile-schema";

export const foodRelations = relations(foodSchema, ({ many, one }) => ({
	user: many(profileSchema),
	mealItem: many(mealItemSchema),
}));

export const mealItemRelation = relations(mealItemSchema, ({ one }) => ({
	food: one(foodSchema, {
		fields: [mealItemSchema.foodId],
		references: [foodSchema.id],
	}),
}));
