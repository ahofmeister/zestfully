"use client";

import { addDays, addWeeks, format, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import useUpdateQueryParams from "@/app/use-update-query-params";
import { Button } from "@/components/ui/button";

interface WeekNavigationProps {
	currentDate: Date;
}

export function WeekNavigation({ currentDate }: WeekNavigationProps) {
	const update = useUpdateQueryParams();
	const [date, setDate] = useState<Date>(currentDate);

	const updateDate = (newDate: Date) => {
		setDate(newDate);
		update({ key: "date", value: format(newDate, "yyyy-MM-dd") });
	};

	return (
		<div className="flex flex-col sm:flex-row gap-4 mb-6">
			<div className={"flex gap-4 items-center justify-center"}>
				<Button
					variant="outline"
					size="icon"
					onClick={() => updateDate(addWeeks(date, -1))}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<h2 className="text-lg font-semibold">
					{format(date, "dd. MM yyyy")} -{" "}
					{format(addDays(date, 7), "dd. MM yyyy")}
				</h2>
				<Button
					variant="outline"
					size="icon"
					onClick={() => updateDate(addWeeks(date, 1))}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
			<Button
				variant="outline"
				onClick={() => updateDate(startOfWeek(new Date(), { weekStartsOn: 1 }))}
			>
				Today
			</Button>
		</div>
	);
}
