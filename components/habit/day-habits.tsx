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

type Habit = typeof habitSchema.$inferSelect & {
	completions: (typeof habitCompletion.$inferSelect)[];
};

export default function DayHabits({
	habits,
	selectedDate,
}: {
	habits: Habit[];
	selectedDate: string;
}) {
	const [_, startTransition] = useTransition();

	const [optimisticUpdates, setOptimisticUpdates] = useState<
		Record<string, { completed: boolean; streak: number }>
	>({});

	const getHabitState = (habit: Habit) => {
		if (optimisticUpdates[habit.id]) {
			return optimisticUpdates[habit.id];
		}

		const completed = habit.completions.some(
			(c) => c.completedAt === selectedDate,
		);

		const streak = calculateCurrentStreak({
			completions: habit.completions.map((c) => c.completedAt),
			frequencyTarget: habit.frequencyTarget,
			frequencyType: habit.frequencyType,
			frequencyDays: habit.frequencyDays,
		});

		return { completed, streak };
	};

	const handleToggle = (
		habitId: string,
		event: React.MouseEvent<HTMLDivElement>,
	) => {
		const habit = habits.find((h) => h.id === habitId);
		if (!habit) {
			return;
		}

		const currentState = getHabitState(habit);
		const newCompleted = !currentState.completed;

		if (newCompleted) {
			const target = event.currentTarget;
			const rect = target.getBoundingClientRect();
			const x = (rect.left + rect.width / 2) / window.innerWidth;
			const y = (rect.top + rect.height / 2) / window.innerHeight;
			confetti({ origin: { x, y } });
		}

		const updatedCompletions = newCompleted
			? [...habit.completions.map((c) => c.completedAt), selectedDate]
			: habit.completions
					.map((c) => c.completedAt)
					.filter((date) => date !== selectedDate);

		const newStreak = calculateCurrentStreak({
			completions: updatedCompletions,
			frequencyTarget: habit.frequencyTarget,
			frequencyType: habit.frequencyType,
			frequencyDays: habit.frequencyDays,
		});

		setOptimisticUpdates((prev) => ({
			...prev,
			[habitId]: { completed: newCompleted, streak: newStreak },
		}));

		startTransition(async () => {
			try {
				await toggleHabitCompletion(habitId, selectedDate);
			} catch (_) {
				setOptimisticUpdates((prev) => ({
					...prev,
					[habitId]: currentState,
				}));
			}
		});
	};

	return (
		<div className="space-y-2">
			{habits.map((habit) => {
				const { completed, streak } = getHabitState(habit);

				return (
					<Card
						key={habit.id}
						onClick={(e) => handleToggle(habit.id, e)}
						className="flex items-center p-4 rounded-lg transition-colors gap-x-4 cursor-pointer hover:bg-secondary"
					>
						<Checkbox checked={completed} />

						<div className="flex flex-col">
							<span
								className={
									completed ? "line-through text-muted-foreground" : ""
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
