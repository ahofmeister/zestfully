"use server"
import {NewRecipe} from "@/utils/supabase/types";
import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";

export async function saveRecipe(recipe: NewRecipe) {
    const supabase = await createClient();

    const {ingredients, ...recipeWithoutIngredients} = recipe;

    const {error} = await supabase.from("recipe").insert(recipeWithoutIngredients);
    console.log(error);

    ingredients.map(async ingredient => {
        const {data, error} = await supabase.from("ingredient").insert(ingredient);
        console.log(data);
        console.log(error);
    })
}

export async function deleteRecipe(id: string) {
    const supabase = await createClient();
    const {error} = await supabase.from("recipe").delete().eq("id", id)

    if (error) {
        console.error(error);
    }
    revalidatePath("recipes")
}