"use client";

import { addDays, format, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

export function DateSelector() {
	const [date, setDate] = useQueryState(
		"date",
		parseAsIsoDate.withDefault(new Date()),
	);

	const isTodaySelected = isToday(date);

	const changeDate = (offset: number) => {
		const newDate = offset === 0 ? new Date() : addDays(date, offset);
		void setDate(newDate);
	};

	return (
		<div className="flex items-center justify-center gap-4">
			<Button
				variant="outline"
				size="icon"
				onClick={() => changeDate(-1)}
				className="h-10 w-10"
				aria-label="Previous day"
			>
				<ChevronLeft className="h-5 w-5" />
			</Button>

			<div className="flex min-w-[200px] flex-col items-center gap-1">
				<div className="text-sm text-muted-foreground">
					{format(date, "EEEE")}
				</div>
				<div className="text-2xl font-bold">{format(date, "MMM d, yyyy")}</div>
				{!isTodaySelected && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => changeDate(0)}
						className="h-7 text-xs text-primary hover:text-primary"
					>
						Jump to Today
					</Button>
				)}
				{isTodaySelected && (
					<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
						Today
					</span>
				)}
			</div>

			<Button
				variant="outline"
				size="iconSm"
				onClick={() => changeDate(1)}
				className="h-10 w-10"
				aria-label="Next day"
			>
				<ChevronRight className="h-5 w-5" />
			</Button>
		</div>
	);
}
