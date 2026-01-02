"use client";

import { isToday } from "date-fns";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

export function TodayLink({ selectedDate }: { selectedDate: string }) {
	const [, setDate] = useQueryState(
		"date",
		parseAsIsoDate.withDefault(new Date()).withOptions({
			shallow: false,
		}),
	);

	if (isToday(selectedDate)) {
		return null;
	}

	return (
		<Button
			variant="link"
			size="sm"
			onClick={() => setDate(null)}
			className="h-auto p-0 text-xs text-muted-foreground"
		>
			Today
		</Button>
	);
}
