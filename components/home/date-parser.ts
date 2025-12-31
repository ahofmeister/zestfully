import { createLoader, parseAsIsoDate } from "nuqs/server";

export const dateSearchParam = {
	date: parseAsIsoDate.withDefault(new Date()),
};
export const loadSearchParams = createLoader(dateSearchParam);
