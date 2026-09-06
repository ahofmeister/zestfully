import { relations } from "drizzle-orm";
import { foodSchema } from "@/drizzle/schema/food-schema";
import { ingredientSchema } from "@/drizzle/schema/ingredient-schema";
import { mealItemSchema } from "@/drizzle/schema/meal-item-schema";
import { profileSchema } from "@/drizzle/schema/profile-schema";
import { recipeSchema } from "@/drizzle/schema/recipe-schema";

export const foodRelations = relations(foodSchema, ({ many }) => ({
	user: many(profileSchema),
	mealItem: many(mealItemSchema),
}));

export const mealItemRelation = relations(mealItemSchema, ({ one }) => ({
	food: one(foodSchema, {
		fields: [mealItemSchema.foodId],
		references: [foodSchema.id],
	}),
}));

export const recipeRelations = relations(recipeSchema, ({ one, many }) => ({
	user: one(profileSchema, {
		fields: [recipeSchema.userId],
		references: [profileSchema.id],
	}),
	ingredients: many(ingredientSchema),
}));

export const ingredientRelations = relations(ingredientSchema, ({ one }) => ({
	user: one(profileSchema, {
		fields: [ingredientSchema.userId],
		references: [profileSchema.id],
	}),
	food: one(foodSchema, {
		fields: [ingredientSchema.foodId],
		references: [foodSchema.id],
	}),
	recipe: one(recipeSchema, {
		fields: [ingredientSchema.recipeId],
		references: [recipeSchema.id],
	}),
}));
