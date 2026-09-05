"use server";
import { eq, inArray } from "drizzle-orm";
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

export const copyMealItems = async (
	newMealType: MealType,
	date: string,
	mealItems: MealItemWithFood[],
) => {
	if (mealItems.length === 0) {
		return;
	}

	const newItems = mealItems.map(({ id, updatedAt, createdAt, ...rest }) => ({
		...rest,
		mealType: newMealType,
		date,
	}));

	await dbTransaction((tx) => {
		return tx.insert(mealItemSchema).values(newItems);
	});

	revalidatePath("/home", "page");
};

export const deleteMealItems = async (mealItemIds: string[]) => {
	await dbTransaction((tx) =>
		tx.delete(mealItemSchema).where(inArray(mealItemSchema.id, mealItemIds)),
	);

	revalidatePath("/home", "page");
};

export const splitMealItems = async (
	mealItems: MealItemWithFood[],
	date: string,
	mealType: MealType,
) => {
	const splitMealItems: MealItemWithFood[] = mealItems.map((item) => ({
		...item,
		quantity: Math.round(item.quantity / 2),
	}));

	try {
		await dbTransaction(async (tx) => {
			await Promise.all(
				splitMealItems.map((item) =>
					tx
						.update(mealItemSchema)
						.set({ quantity: item.quantity })
						.where(eq(mealItemSchema.id, item.id)),
				),
			);

			await tx.insert(mealItemSchema).values(
				splitMealItems.map((item) => ({
					mealType: mealType,
					foodId: item.food.id,
					quantity: item.quantity,
					date: date,
				})),
			);
		});
	} catch (error) {
		console.error(error);
	}

	revalidatePath("/home", "page");
};
