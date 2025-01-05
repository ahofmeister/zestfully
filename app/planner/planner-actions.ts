"use server";
import { createClient } from "@/utils/supabase/server";
import { NewMealPlan } from "@/utils/supabase/types";
import { revalidatePath } from "next/cache";

export async function addPlanStuff(mealPlan: NewMealPlan) {
  const supabase = await createClient();
  const {  error } = await supabase.from("meal_plan").insert(mealPlan);

  if (error) {
    console.error(error);
  } else {
    revalidatePath("/planner", "page");
  }
}

export async function deleteEntry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("meal_plan").delete().eq("id", id);

  if (error) {
    console.error(error);
  } else {
    revalidatePath("/planner", "page");
  }
}
