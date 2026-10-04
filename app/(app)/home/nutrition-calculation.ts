import type { QuantifiedNutrients } from "@/drizzle/schema";

export const calculateNutrient = (
	quantity: number,
	nutrientPer100g: number | null | undefined,
): number => {
	if (!nutrientPer100g) {
		return 0;
	}
	return round((nutrientPer100g * quantity) / 100, 0, 2);
};

export const calculateNutrients = (
	quantifiedNutrients: QuantifiedNutrients[] | QuantifiedNutrients,
) => {
	const items = Array.isArray(quantifiedNutrients) ? quantifiedNutrients : [quantifiedNutrients];

	return items?.reduce(
		(totals, quantifiedNutrients) => {
			const nutrients = quantifiedNutrients.nutrients;
			const quantity = quantifiedNutrients.quantity;
			return {
				energy: round(totals.energy + calculateNutrient(quantity, nutrients.energy)),
				protein: round(totals.protein + calculateNutrient(quantity, nutrients.protein)),
				carbohydrates: round(
					totals.carbohydrates + calculateNutrient(quantity, nutrients.carbohydrates),
				),
				fat: round(totals.fat + calculateNutrient(quantity, nutrients.fat)),
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
