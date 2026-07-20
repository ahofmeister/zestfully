import type { MealItemWithFood } from "@/drizzle/schema";

export const calculateNutrient = (
	quantity: number,
	nutrientPer100g: number | null | undefined,
): number => {
	if (!nutrientPer100g) {
		return 0;
	}
	return round((nutrientPer100g * quantity) / 100, 0, 2);
};

export const calculateNutrients = (mealItems: MealItemWithFood | MealItemWithFood[]) => {
	const items = Array.isArray(mealItems) ? mealItems : [mealItems];

	return items?.reduce(
		(totals, mealItem) => {
			const quantity = mealItem.quantity;

			return {
				energy: round(totals.energy + calculateNutrient(quantity, mealItem.food.energy)),
				protein: round(
					totals.protein + calculateNutrient(mealItem.quantity, mealItem.food.protein),
				),
				carbohydrates: round(
					totals.carbohydrates + calculateNutrient(mealItem.quantity, mealItem.food.carbohydrates),
				),
				fat: round(totals.fat + calculateNutrient(mealItem.quantity, mealItem.food.fat)),
			};
		},
		{ energy: 0, protein: 0, carbohydrates: 0, fat: 0 },
	);
};

export function round(
	value: number,
	minimumFractionDigits: number = 0,
	maximumFractionDigits: number = 2,
) {
	const formattedValue = value.toLocaleString("en", {
		useGrouping: false,
		minimumFractionDigits,
		maximumFractionDigits,
	});
	return Number(formattedValue);
}

export const macroColors = {
	protein: "--chart-2",
	carbohydrates: "--chart-4",
	fat: "--chart-3",
} as const;
