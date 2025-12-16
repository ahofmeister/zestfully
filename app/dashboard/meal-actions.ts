"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/client";
import { mealItems } from "@/drizzle/schema";

export async function deleteMealItem(id: string) {
  try {
    await db.delete(mealItems).where(eq(mealItems.id, id));
    revalidatePath("/track");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "Failed to delete" };
  }
}
