"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const createShoppingList = async (name: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("shopping_list").insert({ name: name });

  if (error) {
    console.log(error);
  } else {
    revalidatePath("/shopping-list", "page");
  }
};

export const deleteShoppingList = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("shopping_list").delete().eq("id", id);

  if (error) {
    console.log(error);
  } else {
    revalidatePath("/shopping-list", "page");
  }
};
