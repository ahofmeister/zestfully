"use client";
import confetti from "canvas-confetti";
import { isToday } from "date-fns";
import { CalendarDays } from "lucide-react";
import type React from "react";
import { useOptimistic, useState, useTransition } from "react";
import {
	formatDate,
	generateYearWeeks,
	getMonthLabels,
} from "@/components/dates";
import { toggleHabitCompletion } from "@/components/habit/habit-actions";
import { HabitFrequency } from "@/components/habit/habit-frequency";
import HabitSettings from "@/components/habit/habit-settings";
import SparkButton from "@/components/habit/spark/spark-button";
import { calculateCurrentStreak } from "@/components/habit/streak-calculator";
import { Button } from "@/components/ui/button";
import type { habitCompletion, habitSchema } from "@/drizzle/schema";
import { cn } from "@/lib/utils";

export default function HabitGrid({
	habit,
	isOwner,
	sparkCount = 0,
	hasSparked = false,
}: {
	habit: typeof habitSchema.$inferSelect & {
		completions: (typeof habitCompletion.$inferSelect)[];
	};
	isOwner: boolean;
	sparkCount?: number;
	hasSparked?: boolean;
}) {
	const [hoveredDate, setHoveredDate] = useState<string | null>(null);
	const [_, startTransition] = useTransition();

	const [optimisticCompletions, setOptimisticCompletions] = useOptimistic(
		habit.completions,
		(state, newCompletion: { action: "add" | "remove"; date: string }) => {
			if (newCompletion.action === "add") {
				return [
					...state,
					{
						id: crypto.randomUUID(),
						habitId: habit.id,
						completedAt: newCompletion.date,
						createdAt: new Date(),
					},
				];
			}
			return state.filter((c) => c.completedAt !== newCompletion.date);
		},
	);

	const weeks = generateYearWeeks();
	const monthLabels = getMonthLabels(weeks);

	const totalDays = optimisticCompletions.length;

	const completionDates = new Set(
		optimisticCompletions.map((c) => c.completedAt),
	);

	const handleToggleDay = async (
		habitId: string,
		date: string,
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		const selectedDate = new Date(date);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		selectedDate.setHours(0, 0, 0, 0);

		if (selectedDate.getTime() > today.getTime()) {
			return;
		}

		const isCompleted = completionDates.has(date);

		startTransition(async () => {
			setOptimisticCompletions({
				action: isCompleted ? "remove" : "add",
				date,
			});

			if (!isCompleted) {
				const rect = event.currentTarget.getBoundingClientRect();
				const x = (rect.left + rect.width / 2) / window.innerWidth;
				const y = (rect.top + rect.height / 2) / window.innerHeight;

				confetti({
					origin: { x, y },
				});
			}

			await toggleHabitCompletion(habitId, date);
		});
	};

	const currentStreak = calculateCurrentStreak({
		completions: optimisticCompletions.map((c) => c.completedAt),
		frequencyType: habit.frequencyType,
		frequencyTarget: habit.frequencyTarget ?? 0,
		frequencyDays: habit.frequencyDays ?? [],
	});

	return (
		<div className="group space-y-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h3 className="font-mono text-lg font-semibold">{habit.name}</h3>
					{isOwner && (
						<div className="flex items-center gap-0.5 transition-opacity text-muted-foreground">
							<HabitSettings habit={habit} />
						</div>
					)}
				</div>
			</div>

			<div className="flex items-center gap-5 text-xs font-mono text-muted-foreground">
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<CalendarDays className="h-3 w-3" />
					<HabitFrequency habit={habit} />
				</div>

				<span>{totalDays} days</span>

				{currentStreak > 0 && <span>🔥 {currentStreak} streak</span>}

				<SparkButton
					habitId={habit.id}
					initialCount={sparkCount}
					initialSparked={hasSparked}
					isOwner={isOwner}
				/>
			</div>

			<div className="overflow-x-auto py-1">
				<div className="inline-flex gap-2">
					<div className="flex flex-col gap-1">
						<div className="h-3" />
						{["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
							<div
								key={`${day}-${i}`}
								className="flex h-[16px] items-center justify-end font-mono text-[9px] text-muted-foreground"
							>
								{day}
							</div>
						))}
					</div>

					<div className="flex flex-col">
						<div className="flex gap-1">
							{weeks.map((week, weekIndex) => {
								const firstDate = week.find((d) => d);
								const weekKey = firstDate
									? formatDate(firstDate)
									: `week-${weekIndex}`;

								return (
									<div key={weekKey} className="flex flex-col gap-1">
										<div className="h-3 font-mono text-[9px] text-muted-foreground">
											{monthLabels[weekIndex]}
										</div>

										{week.map((date, dayIndex) => {
											if (!date) {
												return (
													<div
														key={`${weekKey}-empty-${dayIndex}`}
														className="h-[16px] w-[16px]"
													/>
												);
											}

											const dateStr = formatDate(date);
											const isCompleted = completionDates.has(dateStr);
											const isTodayDate = isToday(date);

											return (
												<Button
													size="icon"
													key={dateStr}
													variant="ghost"
													style={
														isCompleted
															? {
																	backgroundColor: habit.color,
																	borderColor: `${habit.color}80`,
																}
															: undefined
													}
													disabled={new Date(dateStr) > new Date() || !isOwner}
													onClick={(e) => handleToggleDay(habit.id, dateStr, e)}
													onMouseEnter={() => setHoveredDate(dateStr)}
													onMouseLeave={() => setHoveredDate(null)}
													className={cn(
														"h-[16px] w-[16px] rounded-sm border p-0 transition-all hover:scale-110",
														isCompleted ? "shadow-sm" : "bg-secondary/30",
														isTodayDate && "ring-1 ring-primary",
														isOwner && "cursor-pointer",
													)}
												/>
											);
										})}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between min-h-4">
				{hoveredDate && (
					<div className="font-mono text-[10px] text-muted-foreground">
						{new Date(hoveredDate).toLocaleDateString("en-US", {
							weekday: "short",
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</div>
				)}
			</div>
		</div>
	);
}
