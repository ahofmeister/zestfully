"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/client";
import { type MealType, mealItems } from "@/drizzle/schema";

export async function deleteMealItem(id: string) {
	try {
		await db.delete(mealItems).where(eq(mealItems.id, id));
		revalidatePath("/track");
		return { success: true };
	} catch (_error) {
		return { success: false, error: "Failed to delete" };
	}
}

export async function addMealItem(
	_prevState: any,
	formData: FormData,
): Promise<{ success: boolean; error?: string } | null> {
	try {
		const userId = formData.get("userId") as string;
		const date = formData.get("date") as string;
		const foodId = formData.get("foodId") as string;
		const quantity = formData.get("quantity") as string;
		const mealType = formData.get("mealType") as MealType;

		await db.insert(mealItems).values({
			userId: userId,
			foodId: foodId,
			date: date,
			mealType: mealType,
			quantity: quantity,
			unit: "g",
		});

		return { success: true };
	} catch (_error) {
		return { success: false, error: "Failed to add meal item" };
	}
}
