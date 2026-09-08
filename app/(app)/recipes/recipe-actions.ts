"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/drizzle/client";
import {
	ingredientSchema,
	type NewRecipeWithIngredients,
	type RecipeWithIngredients,
	recipeSchema,
} from "@/drizzle/schema";

export async function saveRecipe(recipe: RecipeWithIngredients | NewRecipeWithIngredients) {
	const { ingredients, ...recipeWithoutIngredients } = recipe;

	return await dbTransaction(async (tx) => {
		const [savedRecipe] =
			recipeWithoutIngredients.id !== undefined
				? await tx
						.update(recipeSchema)
						.set(recipeWithoutIngredients)
						.where(eq(recipeSchema.id, recipeWithoutIngredients.id))
						.returning()
				: await tx.insert(recipeSchema).values(recipeWithoutIngredients).returning();

		if (recipeWithoutIngredients.id !== undefined) {
			await tx.delete(ingredientSchema).where(eq(ingredientSchema.recipeId, savedRecipe.id));
		}

		if (ingredients.length > 0) {
			await tx.insert(ingredientSchema).values(
				ingredients.map((ingredient) => ({
					...ingredient,
					recipeId: savedRecipe.id,
				})),
			);
		}

		return savedRecipe;
	});
}

export async function deleteRecipe(id: string) {
	await dbTransaction((tx) => tx.delete(recipeSchema).where(eq(recipeSchema.id, id)));

	revalidatePath("recipes");
}
