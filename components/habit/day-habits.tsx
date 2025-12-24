"use client";
import { CheckCircle2, CheckIcon, Circle, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toggleHabitCompletion } from "@/components/habit/habit-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	const [isPending, startTransition] = useTransition();

	const handleToggle = (habitId: string) => {
		startTransition(async () => {
			await toggleHabitCompletion(habitId, selectedDate);
		});
	};

	return (
		<div className="space-y-2">
			<Link href="/habits">
				<Button variant="link">View All Habits →</Button>
			</Link>

			<div className={"bg-secondary rounded-xl"}>
				{habits.length === 0 ? (
					<div className="text-center">
						<p className="text-muted-foreground mb-4">No habits yet</p>
						<Link href="/habits">
							<Button>Create your first habit</Button>
						</Link>
					</div>
				) : (
					<div className="space-y-2">
						{habits.map((habit) => {
							const isCompleted = habit.completions.some(
								(c) => c.completedAt === selectedDate,
							);

							return (
								<div
									key={habit.id}
									className="flex items-center justify-between p-3 rounded-lg transition-colors"
								>
									<div className="flex items-center gap-3 flex-1">
										<span
											className={
												isCompleted ? "line-through text-muted-foreground" : ""
											}
										>
											{habit.name}
										</span>
									</div>

									<Button
										size="sm"
										variant={"ghost"}
										onClick={() => handleToggle(habit.id)}
										disabled={isPending}
									>
										{isCompleted ? <CheckIcon /> : <PlusIcon />}
									</Button>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
