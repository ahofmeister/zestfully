"use client";

import { PencilIcon } from "lucide-react";
import type React from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import { updateHabitFrequency } from "@/components/habit/habit-actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	FREQUENCY_TYPES,
	type FrequencyType,
	type habitSchema,
	WEEKDAYS,
	type Weekday,
} from "@/drizzle/schema";

export default function EditHabitFrequency(props: {
	habit: typeof habitSchema.$inferSelect;
}) {
	const formRef = useRef<HTMLFormElement>(null);
	const [open, setOpen] = useState(false);

	const [frequencyType, setFrequencyType] = useState<FrequencyType>(
		props.habit.frequencyType,
	);
	const [frequencyTarget, setFrequencyTarget] = useState<number>(
		props.habit.frequencyTarget || 1,
	);
	const frequencyDays1 = props.habit.frequencyDays;
	const [frequencyDays, setFrequencyDays] = useState<Weekday[]>(
		frequencyDays1 || [],
	);

	const [state, formAction, isPending] = useActionState(updateHabitFrequency, {
		success: false,
		error: undefined,
	});

	useEffect(() => {
		if (state?.success) {
			setOpen(false);
			formRef.current?.reset();
		}
	}, [state]);

	const toggleDay = (day: Weekday) => {
		setFrequencyDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
		);
	};

	const incrementTarget = () =>
		setFrequencyTarget((prev) => Math.min(7, prev + 1));
	const decrementTarget = () =>
		setFrequencyTarget((prev) => Math.max(1, prev - 1));

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="iconSm">
					<PencilIcon size={10} />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[480px]">
				<form ref={formRef} action={formAction}>
					<DialogHeader>
						<DialogTitle className="text-xl">Edit Habit Frequency</DialogTitle>
					</DialogHeader>

					{/* Hidden inputs for form data */}
					<input type="hidden" name="habitId" value={props.habit.id} />
					<input type="hidden" name="frequencyType" value={frequencyType} />
					{frequencyType === "per_week" && (
						<input
							type="hidden"
							name="frequencyTarget"
							value={frequencyTarget}
						/>
					)}
					{frequencyType === "scheduled_days" &&
						frequencyDays.map((day) => (
							<input key={day} type="hidden" name="frequencyDays" value={day} />
						))}

					<div className="flex gap-2 py-6">
						{FREQUENCY_TYPES.map((type) => (
							<Button
								key={type}
								type="button"
								variant={frequencyType === type ? "default" : "outline"}
								className="flex-1 transition-all"
								onClick={() => {
									setFrequencyType(type as FrequencyType);
									if (type === "per_week") {
										setFrequencyTarget(1);
									}
									if (type === "scheduled_days") {
										setFrequencyDays([]);
									}
								}}
								disabled={isPending}
							>
								{type === "daily"
									? "Daily"
									: type === "per_week"
										? "X / week"
										: "Specific days"}
							</Button>
						))}
					</div>

					{frequencyType === "per_week" && (
						<div className="flex items-center justify-center gap-4 py-6 mb-2">
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={decrementTarget}
								disabled={isPending || frequencyTarget <= 1}
								className="h-10 w-10 shrink-0 transition-all hover:scale-105 bg-transparent"
								aria-label="Decrease frequency"
							>
								<span className="text-lg font-semibold">−</span>
							</Button>
							<div className="text-center min-w-[140px]">
								<div className="text-3xl font-bold tabular-nums">
									{frequencyTarget}
								</div>
								<div className="text-sm text-muted-foreground mt-1">
									{frequencyTarget === 1 ? "time per week" : "times per week"}
								</div>
							</div>
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={incrementTarget}
								disabled={isPending || frequencyTarget >= 7}
								className="h-10 w-10 shrink-0 transition-all hover:scale-105"
								aria-label="Increase frequency"
							>
								<span className="text-lg font-semibold">+</span>
							</Button>
						</div>
					)}

					{frequencyType === "scheduled_days" && (
						<div className="space-y-3 py-4 mb-2">
							<p className="text-sm text-muted-foreground text-center">
								Select the days you want to perform this habit
							</p>
							<div className="grid grid-cols-7 gap-2">
								{WEEKDAYS.map((day) => {
									const isSelected = frequencyDays.includes(day as Weekday);
									return (
										<Button
											key={day}
											type="button"
											variant={isSelected ? "default" : "outline"}
											className={`
												h-14 flex flex-col items-center justify-center gap-1 transition-all
												${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:border-primary/50"}
											`}
											onClick={() => toggleDay(day as Weekday)}
											disabled={isPending}
											aria-label={`${day}, ${isSelected ? "selected" : "not selected"}`}
											aria-pressed={isSelected}
										>
											<span className="text-xs font-semibold uppercase tracking-wide">
												{day.slice(0, 3)}
											</span>
										</Button>
									);
								})}
							</div>
							{frequencyDays.length > 0 && (
								<p className="text-xs text-center text-muted-foreground">
									{frequencyDays.length}{" "}
									{frequencyDays.length === 1 ? "day" : "days"} selected
								</p>
							)}
						</div>
					)}

					{state?.error && (
						<div className="rounded-md bg-destructive/10 p-3 mb-4">
							<p className="text-sm text-destructive">{state.error}</p>
						</div>
					)}

					<DialogFooter className="gap-2 mt-6">
						<DialogClose asChild>
							<Button
								type="button"
								variant="outline"
								disabled={isPending}
								className="flex-1 sm:flex-none bg-transparent"
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							disabled={isPending}
							className="flex-1 sm:flex-none min-w-[100px]"
						>
							{isPending ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
