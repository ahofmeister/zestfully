import { defineRelations } from "drizzle-orm";
import * as schema from "./index";

export const relations = defineRelations(schema, (r) => ({
	foodSchema: {
		user: r.one.profileSchema({
			from: r.foodSchema.userId,
			to: r.profileSchema.id,
			optional: false,
		}),
		mealItems: r.many.mealItemSchema(),
	},

	mealItemSchema: {
		food: r.one.foodSchema({
			from: r.mealItemSchema.foodId,
			to: r.foodSchema.id,
			optional: false,
		}),
	},

	recipeSchema: {
		categories: r.many.recipeCategorySchema({
			from: r.recipeSchema.id.through(r.recipeToCategoriesSchema.recipeId),
			to: r.recipeCategorySchema.id.through(r.recipeToCategoriesSchema.categoryId),
		}),
		ingredients: r.many.ingredientSchema(),
		user: r.one.profileSchema({
			from: r.recipeSchema.userId,
			to: r.profileSchema.id,
			optional: false,
		}),
	},

	recipeCategorySchema: {
		user: r.one.profileSchema({
			from: r.recipeCategorySchema.userId,
			to: r.profileSchema.id,
			optional: false,
		}),
		recipes: r.many.recipeSchema(),
	},

	ingredientSchema: {
		user: r.one.profileSchema({
			from: r.ingredientSchema.userId,
			to: r.profileSchema.id,
			optional: false,
		}),
		food: r.one.foodSchema({
			from: r.ingredientSchema.foodId,
			to: r.foodSchema.id,
			optional: false,
		}),
		recipe: r.one.recipeSchema({
			from: r.ingredientSchema.recipeId,
			to: r.recipeSchema.id,
			optional: false,
		}),
	},

	profileSchema: {
		foods: r.many.foodSchema(),
		recipes: r.many.recipeSchema(),
		ingredients: r.many.ingredientSchema(),
		recipeCategories: r.many.recipeCategorySchema(),
	},
}));
