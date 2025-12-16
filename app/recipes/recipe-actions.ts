"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { NewRecipe } from "@/utils/supabase/types";

export async function saveRecipe(recipe: NewRecipe) {
	const supabase = await createClient();

	const { ingredients, ...recipeWithoutIngredients } = recipe;

	const { data: newRecipe, error } = await supabase
		.from("recipe")
		.insert(recipeWithoutIngredients)
		.select("*")
		.single();
	console.log(error);

	if (newRecipe) {
		ingredients.map(async (ingredient) => {
			const { data, error } = await supabase
				.from("ingredient")
				.insert({ ...ingredient, recipe_id: newRecipe.id });
			console.log(data);
			console.log(error);
		});
	}
}

export async function deleteRecipe(id: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("recipe").delete().eq("id", id);

	if (error) {
		console.error(error);
	}
	revalidatePath("recipes");
}
