"use client";
import confetti from "canvas-confetti";
import { Flame } from "lucide-react";
import type React from "react";
import { useState, useTransition } from "react";
import { toggleHabitCompletion } from "@/components/habit/habit-actions";
import { HabitFrequency } from "@/components/habit/habit-frequency";
import { calculateCurrentStreak } from "@/components/habit/streak-calculator";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { habitCompletion, habitSchema } from "@/drizzle/schema";

export default function DayHabits({
	habits,
	selectedDate,
}: {
	habits: (typeof habitSchema.$inferSelect & {
		completions: (typeof habitCompletion.$inferSelect)[];
	})[];
	selectedDate: string;
}) {
	const [_, startTransition] = useTransition();

	const [optimisticState, setOptimisticState] = useState(() =>
		habits.reduce(
			(acc, habit) => {
				const completed = habit.completions.some(
					(c) => c.completedAt === selectedDate,
				);
				const streak = calculateCurrentStreak({
					completions: habit.completions.map(
						(completions) => completions.completedAt,
					),
					frequencyTarget: habit.frequencyTarget,
					frequencyType: habit.frequencyType,
					frequencyDays: habit.frequencyDays,
				});
				acc[habit.id] = { completed, streak };
				return acc;
			},
			{} as Record<string, { completed: boolean; streak: number }>,
		),
	);

	const getUpdatedOptimisticState = (
		prev: typeof optimisticState,
		habitId: string,
		toggle: boolean,
	) => {
		const habit = habits.find((habit) => habit.id === habitId);

		if (!habit) {
			return prev;
		}

		const allCompletions = toggle
			? [...habit.completions.map((x) => x.completedAt), selectedDate]
			: habit.completions
					.map((completion) => completion.completedAt)
					.filter((date) => date !== selectedDate);

		const newStreak = calculateCurrentStreak({
			completions: allCompletions,
			frequencyTarget: habit.frequencyTarget,
			frequencyType: habit.frequencyType,
			frequencyDays: habit.frequencyDays,
		});

		return {
			...prev,
			[habitId]: { completed: toggle, streak: newStreak },
		};
	};

	const handleToggle = (
		habitId: string,
		event: React.MouseEvent<HTMLDivElement>,
	) => {
		const target = event.currentTarget;
		const rect = target.getBoundingClientRect();
		const x = (rect.left + rect.width / 2) / window.innerWidth;
		const y = (rect.top + rect.height / 2) / window.innerHeight;

		setOptimisticState((prev) => {
			const newCompleted = !prev[habitId].completed;

			if (newCompleted) {
				confetti({ origin: { x, y } });
			}

			return getUpdatedOptimisticState(prev, habitId, newCompleted);
		});

		startTransition(async () => {
			try {
				await toggleHabitCompletion(habitId, selectedDate);
			} catch (_) {
				setOptimisticState((prev) =>
					getUpdatedOptimisticState(prev, habitId, !prev[habitId].completed),
				);
			}
		});
	};

	return (
		<div className="space-y-2">
			{habits.map((habit) => {
				const { completed: isCompleted, streak } = optimisticState[habit.id];

				return (
					<Card
						key={habit.id}
						onClick={(e) => handleToggle(habit.id, e)}
						className="flex items-center p-4 rounded-lg transition-colors gap-x-4 cursor-pointer hover:bg-secondary relative"
					>
						<Checkbox checked={isCompleted}></Checkbox>

						<div className="flex flex-col">
							<span
								className={
									isCompleted ? "line-through text-muted-foreground" : ""
								}
							>
								{habit.name}
							</span>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<HabitFrequency habit={habit} />
								{streak > 0 && (
									<>
										<span>•</span>
										<div className="flex items-center gap-1">
											<Flame size={12} className="text-orange-500" />
											<span className="text-orange-500">{streak}</span>
										</div>
									</>
								)}
							</div>
						</div>
					</Card>
				);
			})}
		</div>
	);
}
