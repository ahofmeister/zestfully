"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/drizzle/client";
import { type MealType, mealItemSchema } from "@/drizzle/schema";

export const addMealItem = async (
	date: Date,
	mealType: MealType,
	foodId: string,
	quantity: number,
) => {
	await dbTransaction((tx) =>
		tx.insert(mealItemSchema).values({
			mealType: mealType,
			foodId: foodId,
			quantity: quantity,
			date: date.toDateString(),
		}),
	);

	revalidatePath("/home", "page");
};

export const deleteMealItem = async (mealItemId: string) => {
	await dbTransaction((tx) => tx.delete(mealItemSchema).where(eq(mealItemSchema.id, mealItemId)));
	revalidatePath("/home", "page");
};
