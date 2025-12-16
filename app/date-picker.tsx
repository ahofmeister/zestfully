"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
	selected?: Date;
	onSelectAction: (date: Date | undefined) => void;
	label: string;
}

export function DatePicker({
	selected,
	onSelectAction,
	label,
}: DatePickerProps) {
	return (
		<div className="flex flex-col space-y-2">
			<Label htmlFor={label}>{label}</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id={label}
						variant={"outline"}
						className={cn(
							"w-[280px] justify-start text-left font-normal",
							!selected && "text-muted-foreground",
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{selected ? format(selected, "PPP") : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={selected}
						onSelect={onSelectAction}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
