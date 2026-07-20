"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/drizzle/client";
import { type MealItemWithFood, type MealType, mealItemSchema } from "@/drizzle/schema";

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

export const copyMealItems = async (newMealType: MealType, mealItems: MealItemWithFood[]) => {
	if (mealItems.length === 0) {
		return;
	}

	const newItems = mealItems.map(({ id, updatedAt, createdAt, ...rest }) => ({
		...rest,
		mealType: newMealType,
	}));

	await dbTransaction((tx) => {
		return tx.insert(mealItemSchema).values(newItems);
	});

	revalidatePath("/home", "page");
};
