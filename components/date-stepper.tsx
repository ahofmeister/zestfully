"use client";

import { addDays } from "date-fns";
import { parseAsIsoDate, useQueryState } from "nuqs";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";

export function DateStepper({ amount, icon }: { amount: number; icon: ReactElement }) {
	const [date, setDate] = useQueryState(
		"date",
		parseAsIsoDate.withDefault(new Date()).withOptions({ shallow: false }),
	);

	const handleStep = () => {
		void setDate(addDays(date, amount));
	};

	return (
		<Button size="sm" variant="outline" onClick={handleStep}>
			{icon}
		</Button>
	);
}
