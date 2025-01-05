"use server";
import { createClient } from "@/utils/supabase/server";
import { NewMealPlan } from "@/utils/supabase/types";
import { revalidatePath } from "next/cache";

export async function addMeal(mealPlan: NewMealPlan) {
  const supabase = await createClient();
  const {  error } = await supabase.from("meal").insert(mealPlan);

  if (error) {
    console.error(error);
  } else {
    revalidatePath("/planner", "page");
  }
}

export async function deleteMeal(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("meal").delete().eq("id", id);

  if (error) {
    console.error(error);
  } else {
    revalidatePath("/planner", "page");
  }
}
