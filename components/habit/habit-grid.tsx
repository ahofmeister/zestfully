"use client";
import confetti from "canvas-confetti";
import {
	CalendarDays,
	CalendarIcon,
	ClockIcon,
	Trash2Icon,
} from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";

import {
	formatDate,
	generateYearWeeks,
	getMonthLabels,
	isDateToday,
} from "@/components/dates";
import EditHabit from "@/components/habit/edit-habit";
import EditHabitFrequency from "@/components/habit/edit-habit-frequency";
import {
	deleteHabit,
	toggleHabitCompletion,
	trackHabitDay,
} from "@/components/habit/habit-actions";
import { HabitFrequency } from "@/components/habit/habit-frequency";
import { HabitVisibility } from "@/components/habit/habit-visibility";
import SparkButton from "@/components/habit/spark/spark-button";
import {
	calculateCompletionPercentage,
	calculateCurrentStreak,
} from "@/components/habit/streak-calculator";
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
	const [isPending, startTransition] = useTransition();

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

	const today = formatDate(new Date());
	const yesterday = (() => {
		const d = new Date();
		d.setDate(d.getDate() - 1);
		return formatDate(d);
	})();

	const completionDates = new Set(
		optimisticCompletions.map((c) => c.completedAt),
	);

	const isTodayTracked = completionDates.has(today);
	const isYesterdayTracked = completionDates.has(yesterday);

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
					particleCount: 8,
					spread: 25,
					origin: { x, y },
					scalar: 0.5,
					gravity: 1.5,
					ticks: 50,
					startVelocity: 10,
				});
			}

			await toggleHabitCompletion(habitId, date);
		});
	};

	const handleTrackToday = async () => {
		startTransition(async () => {
			setOptimisticCompletions({ action: "add", date: today });
			await trackHabitDay(habit.id, today);
		});
	};

	const handleTrackYesterday = async () => {
		startTransition(async () => {
			setOptimisticCompletions({ action: "add", date: yesterday });
			await trackHabitDay(habit.id, yesterday);
		});
	};

	const handleRemove = async () => {
		if (!confirm(`Delete "${habit.name}"? This cannot be undone.`)) return;

		startTransition(async () => {
			await deleteHabit(habit.id);
		});
	};

	const currentStreak = calculateCurrentStreak({
		completions: optimisticCompletions.map((c) => c.completedAt),
		frequencyType: habit.frequencyType,
		frequencyTarget: habit.frequencyTarget ?? 0,
		frequencyDays: habit.frequencyDays ?? [],
	});

	const completionPercentage = calculateCompletionPercentage(
		optimisticCompletions.map((c) => c.completedAt),
		habit.frequencyType,
		habit.frequencyTarget,
		habit.frequencyDays,
	);

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<h3 className="font-mono text-lg font-semibold">{habit.name}</h3>
						{isOwner && <HabitVisibility visibility={habit.visibility} />}
						{isOwner && <EditHabit habit={habit} />}
					</div>
					<div className="flex gap-4 font-mono text-xs text-muted-foreground">
						<div className="flex gap-4 font-mono text-xs text-muted-foreground">
							<span>{totalDays}x</span>
							{currentStreak > 0 && <span>🔥 {currentStreak}x streak</span>}
							<span>{completionPercentage}% complete</span>
							{sparkCount > 0 && <span>✨ {sparkCount}</span>}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{isOwner ? (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={handleTrackToday}
								disabled={isTodayTracked || isPending}
								className="gap-1.5"
							>
								<CalendarIcon className="h-3 w-3" />
								Today
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleTrackYesterday}
								disabled={isYesterdayTracked || isPending}
								className="gap-1.5"
							>
								<ClockIcon className="h-3 w-3" />
								Yesterday
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={handleRemove}
								disabled={isPending}
							>
								<Trash2Icon className="h-4 w-4" />
							</Button>
						</>
					) : (
						<SparkButton
							isLoggedIn={isOwner}
							habitId={habit.id}
							initialCount={sparkCount}
							initialSparked={hasSparked}
						/>
					)}
				</div>
			</div>
			<div className="overflow-x-auto pb-2">
				<div className="inline-flex gap-1">
					<div className="mr-2 flex w-8 flex-col gap-1">
						<div className="h-4" />
						{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
							<div
								key={day}
								className="flex h-[18px] items-center justify-end font-mono text-[10px] text-muted-foreground"
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
										<div className="h-4 font-mono text-[10px] text-muted-foreground">
											{monthLabels[weekIndex]}
										</div>

										{week.map((date, dayIndex) => {
											if (!date) {
												return (
													<div
														key={`${weekKey}-empty-${dayIndex}`}
														className="h-[18px] w-[18px]"
													/>
												);
											}

											const dateStr = formatDate(date);
											const isCompleted = completionDates.has(dateStr);
											const isToday = isDateToday(date);

											return (
												<Button
													size="icon"
													key={dateStr}
													variant={"ghost"}
													style={
														isCompleted
															? {
																	backgroundColor: habit.color,
																	borderColor: `${habit.color}80`,
																}
															: undefined
													}
													disabled={new Date(dateStr) > new Date()}
													onClick={(e) => {
														if (!isOwner) {
															return;
														}

														return handleToggleDay(habit.id, dateStr, e);
													}}
													onMouseEnter={() => setHoveredDate(dateStr)}
													onMouseLeave={() => setHoveredDate(null)}
													className={cn(
														"h-[18px] w-[18px] rounded-sm border p-0 transition-all hover:scale-110",
														isCompleted ? "shadow-sm" : "bg-secondary/30",
														isToday && "ring-1 ring-accent/80",
													)}
												/>
											);
										})}
									</div>
								);
							})}
						</div>

						<div className={"flex justify-between"}>
							<div className="flex mt-3 items-center gap-x-2">
								<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
									<CalendarDays className="h-3 w-3" />
									<HabitFrequency habit={habit} />
								</div>
								{isOwner && <EditHabitFrequency habit={habit} />}
							</div>

							<div className="mt-2 h-5 font-mono text-xs text-muted-foreground self-end">
								{hoveredDate &&
									new Date(hoveredDate).toLocaleDateString("en-US", {
										weekday: "short",
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
