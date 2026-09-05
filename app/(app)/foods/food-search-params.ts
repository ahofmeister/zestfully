import { createLoader, parseAsString } from "nuqs/server";

export const foodSearchParams = {
	query: parseAsString.withDefault(""),
};
export const loadFoodSearchParams = createLoader(foodSearchParams);
