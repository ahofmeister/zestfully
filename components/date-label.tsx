"use client";
import { format } from "date-fns";
import { parseAsIsoDate, useQueryState } from "nuqs";

export function DateLabel() {
	const [date] = useQueryState("date", parseAsIsoDate.withDefault(new Date()));

	return format(date, "dd. MM. yyyy");
}
