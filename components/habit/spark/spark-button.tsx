"use client";

import { Sparkles } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { giveSpark, removeSpark } from "@/components/habit/spark/spark-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SparkButton({
	habitId,
	initialCount,
	initialSparked,
}: {
	habitId: string;
	initialCount: number;
	initialSparked: boolean;
}) {
	const [isPending, startTransition] = useTransition();
	const [optimisticState, setOptimisticState] = useOptimistic(
		{ count: initialCount, sparked: initialSparked },
		(state, action: "add" | "remove") => ({
			count: state.count + (action === "add" ? 1 : -1),
			sparked: action === "add",
		}),
	);

	const handleToggleSpark = () => {
		startTransition(async () => {
			setOptimisticState(optimisticState.sparked ? "remove" : "add");

			if (optimisticState.sparked) {
				await removeSpark(habitId);
			} else {
				await giveSpark(habitId);
			}
		});
	};

	return (
		<Button
			variant={optimisticState.sparked ? "default" : "outline"}
			size="sm"
			onClick={handleToggleSpark}
			disabled={isPending}
			className={cn(
				"gap-1.5",
				optimisticState.sparked && "bg-orange-500 hover:bg-orange-600",
			)}
		>
			<Sparkles size={14} />
			<span>{optimisticState.count}</span>
		</Button>
	);
}
