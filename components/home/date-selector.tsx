"use client";

import {
	addDays,
	eachDayOfInterval,
	endOfWeek,
	format,
	isToday,
	parseISO,
	startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function toLocalDate(dateString: string) {
	const d = parseISO(dateString);
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toDateString(date: Date) {
	return format(date, "yyyy-MM-dd");
}

export function DateSelector() {
	const [dateString, setDateString] = useQueryState(
		"date",
		parseAsString.withDefault(toDateString(new Date())).withOptions({
			shallow: false,
		}),
	);

	const date = toLocalDate(dateString);

	const changeDate = (offset: number) => {
		const next = addDays(date, offset);
		void setDateString(toDateString(next));
	};

	const daysOfWeek = eachDayOfInterval({
		start: startOfWeek(date, { weekStartsOn: 1 }),
		end: endOfWeek(date, { weekStartsOn: 1 }),
	});

	return (
		<Card className="md:p-4">
			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => changeDate(-7)}
					className="h-10 w-10 shrink-0"
					aria-label="Previous week"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				<ul className="flex-1 flex justify-between gap-1 sm:gap-2 md:gap-1">
					{daysOfWeek.map((day) => {
						const isSelected = format(day, "yyyy-MM-dd") === dateString;
						const isTodayDate = isToday(day);

						return (
							<li key={format(day, "yyyy-MM-dd")}>
								<Button
									variant="ghost"
									onClick={() => void setDateString(toDateString(day))}
									className="flex flex-col items-center gap-2 py-2 px-1 h-auto hover:bg-accent"
								>
									<div
										className={cn(
											"text-xs font-medium",
											isSelected ? "text-foreground" : "text-muted-foreground",
										)}
									>
										{format(day, "EEEEE")}
									</div>

									<div
										className={cn(
											"w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
											isSelected && "bg-primary text-primary-foreground",
											isTodayDate &&
												!isSelected &&
												"ring-2 ring-primary ring-offset-2 ring-offset-background",
										)}
									>
										{format(day, "d")}
									</div>
								</Button>
							</li>
						);
					})}
				</ul>

				<Button
					variant="ghost"
					size="icon"
					onClick={() => changeDate(7)}
					className="h-10 w-10 shrink-0"
					aria-label="Next week"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</Card>
	);
}
