"use client";

import { addDays, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

export function DateSelector() {
	const [date, setDate] = useQueryState(
		"date",
		parseAsIsoDate.withDefault(new Date()),
	);

	const changeDate = (offset: number) => {
		if (offset === 0) {
			void setDate(new Date(), { shallow: false });
		} else {
			setDate(addDays(date, offset), { shallow: false });
		}
	};

	return (
		<div className="flex items-center gap-2">
			<Button variant="outline" size="icon" onClick={() => changeDate(-1)}>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			<div className="min-w-[150px] text-center">
				<div className="font-semibold">{format(date, "MMM d, yyyy")}</div>
				<Button
					variant="link"
					size="sm"
					onClick={() => changeDate(0)}
					className="text-xs"
				>
					Today
				</Button>
			</div>

			<Button variant="outline" size="icon" onClick={() => changeDate(1)}>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
