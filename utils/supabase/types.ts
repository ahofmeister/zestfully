import {Database} from "@/utils/supabase/supabase-types";

export type Food = Database["public"]["Tables"]["food"]["Row"]
export type Recipe = Database["public"]["Tables"]["recipe"]["Row"]
export type NewIngredient = Database["public"]["Tables"]["ingredient"]["Insert"]
export type NewRecipe = Database["public"]["Tables"]["recipe"]["Insert"] & {
    ingredients:  NewIngredient[]
}


export type NewMealPlan = Database["public"]["Tables"]["meal_plan"]["Insert"]
export type MealPlan = Database["public"]["Tables"]["meal_plan"]["Row"]
