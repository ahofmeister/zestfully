// components/dashboard/habits-client.tsx
"use client";
import { CheckCircle2, Circle } from "lucide-react";
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

	const completedCount = habits.filter((h) =>
		h.completions.some((c) => c.completedAt === selectedDate),
	).length;

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>Habits</span>
						<span className="text-sm font-normal text-muted-foreground">
							{completedCount}/{habits.length} completed
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{habits.length === 0 ? (
						<div className="text-center py-8">
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
										className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
									>
										<div className="flex items-center gap-3 flex-1">
											{isCompleted ? (
												<CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
											) : (
												<Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
											)}
											<span
												className={
													isCompleted
														? "line-through text-muted-foreground"
														: ""
												}
											>
												{habit.name}
											</span>
										</div>

										<Button
											size="sm"
											variant={isCompleted ? "outline" : "default"}
											onClick={() => handleToggle(habit.id)}
											disabled={isPending}
										>
											{isCompleted ? "Untrack" : "Track"}
										</Button>
									</div>
								);
							})}
						</div>
					)}
				</CardContent>
			</Card>

			<div className="flex justify-center">
				<Link href="/habits">
					<Button variant="outline">View All Habits →</Button>
				</Link>
			</div>
		</div>
	);
}
