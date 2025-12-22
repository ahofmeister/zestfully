"use client";

import { Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { giveSpark, removeSpark } from "@/components/habit/spark/spark-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SparkButton({
	habitId,
	initialCount,
	initialSparked,
	isLoggedIn,
}: {
	habitId: string;
	initialCount: number;
	initialSparked: boolean;
	isLoggedIn: boolean;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();
	const [showPrompt, setShowPrompt] = useState(false);
	const [optimisticState, setOptimisticState] = useOptimistic(
		{ count: initialCount, sparked: initialSparked },
		(state, action: "add" | "remove") => ({
			count: state.count + (action === "add" ? 1 : -1),
			sparked: action === "add",
		}),
	);

	const handleToggleSpark = () => {
		if (!isLoggedIn) {
			setShowPrompt(true);
			setTimeout(() => setShowPrompt(false), 3000);
			return;
		}

		startTransition(async () => {
			setOptimisticState(optimisticState.sparked ? "remove" : "add");

			if (optimisticState.sparked) {
				await removeSpark(habitId);
			} else {
				await giveSpark(habitId);
			}
		});
	};

	if (showPrompt) {
		return (
			<Button
				variant="outline"
				size="sm"
				onClick={() => router.push(`/sign-in?redirect=${pathname}`)}
				className="gap-1.5 animate-in fade-in"
			>
				<Sparkles className="h-3 w-3" />
				<span className="text-xs">Sign in to spark</span>
			</Button>
		);
	}

	return (
		<Button
			variant={optimisticState.sparked ? "default" : "outline"}
			size="sm"
			onClick={handleToggleSpark}
			disabled={isPending}
			className={cn(
				"gap-1.5 transition-all",
				optimisticState.sparked && "bg-orange-500 hover:bg-orange-600",
			)}
		>
			<Sparkles className="h-3 w-3" />
			<span>{optimisticState.count}</span>
		</Button>
	);
}
