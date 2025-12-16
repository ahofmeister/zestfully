export const calculateNutrient = (
	quantity: number,
	nutrientPer100g: number | null | undefined,
): number => {
	if (!nutrientPer100g) {
		return 0;
	}
	return Math.round((nutrientPer100g * quantity) / 100);
};

export const calculateEnergy = (
	quantity: number,
	energy: number | null | undefined,
): number => {
	return calculateNutrient(quantity, energy);
};

export const calculateProtein = (
	quantity: number,
	protein: number | null | undefined,
): number => {
	return calculateNutrient(quantity, protein);
};

export const calculateCarbs = (
	quantity: number,
	carbs: number | null | undefined,
): number => {
	return calculateNutrient(quantity, carbs);
};

export const calculateFat = (
	quantity: number,
	fat: number | null | undefined,
): number => {
	return calculateNutrient(quantity, fat);
};
