"use server";
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
