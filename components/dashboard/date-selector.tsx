"use client";

import {
	addDays,
	eachDayOfInterval,
	endOfWeek,
	formatDate,
	startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DateSelector() {
	const [date, setDate] = useQueryState(
		"date",
		parseAsIsoDate.withDefault(new Date()).withOptions({
			shallow: false,
		}),
	);

	const changeDate = (offset: number) => {
		const newDate = offset === 0 ? new Date() : addDays(date, offset);
		void setDate(newDate);
	};

	const today = new Date();

	const daysOfWeek: Date[] = eachDayOfInterval({
		start: startOfWeek(date, { weekStartsOn: 1 }),
		end: endOfWeek(date, { weekStartsOn: 1 }),
	});

	return (
		<div className="flex items-center justify-center gap-4">
			<div className={"flex flex-col gap-y-2 w-full"}>
				<div className={"self-center"}>{formatDate(date, "EEEE dd MMMM")}</div>
				<div className={"flex gap-x-4 items-center"}>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => changeDate(-7)}
						className="h-10 w-10"
						aria-label="Previous day"
					>
						<ChevronLeft className="h-5 w-5" />
					</Button>
					<ul className="flex gap-x-1 justify-between flex-1 items-center">
						{daysOfWeek.map((day) => (
							<li key={day.toISOString()}>
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground flex flex-col h-auto p-2 gap-y-2 cursor-pointer"
									onClick={() => void setDate(day)}
								>
									<div
										className={cn(
											"rounded-full w-6 h-6 flex items-center justify-center border",
											formatDate(today, "yyyy-MM-dd") ===
												formatDate(day, "yyyy-MM-dd")
												? "border-primary"
												: "border-transparent",
										)}
									>
										{formatDate(day, "EEEEE")}
									</div>
									<div className="rounded-full border border-primary size-5"></div>
								</Button>
							</li>
						))}
					</ul>
					<Button
						variant="ghost"
						size="iconSm"
						onClick={() => changeDate(7)}
						className="h-10 w-10"
						aria-label="Next day"
					>
						<ChevronRight className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</div>
	);
}
