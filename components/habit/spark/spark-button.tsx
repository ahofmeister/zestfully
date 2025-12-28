"use client";

import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { giveSpark, removeSpark } from "@/components/habit/spark/spark-actions";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function SparkButton({
	habitId,
	initialCount,
	initialSparked,
	isOwner,
}: {
	habitId: string;
	initialCount: number;
	initialSparked: boolean;
	isOwner: boolean;
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
		if (isOwner) {
			return;
		}

		startTransition(async () => {
			setOptimisticState(optimisticState.sparked ? "remove" : "add");

			const result = optimisticState.sparked
				? await removeSpark(habitId)
				: await giveSpark(habitId);

			if (result?.error === "NOT_AUTHENTICATED") {
				setShowPrompt(true);
				setTimeout(() => setShowPrompt(false), 3000);
				setOptimisticState(optimisticState.sparked ? "add" : "remove");
			}
		});
	};

	if (showPrompt) {
		return (
			<Button
				variant="ghost"
				size="sm"
				onClick={() => router.push(`/sign-in?redirect=${pathname}`)}
				className="gap-1.5 animate-in fade-in"
			>
				<span className="text-xs">Sign in to spark</span>
			</Button>
		);
	}

	const SparkInline = (
		<button
			type="button"
			onClick={handleToggleSpark}
			disabled={isPending || isOwner}
			className={cn(
				"inline-flex items-center gap-1 font-mono text-xs",
				"select-none rounded-sm px-1",
				"bg-transparent border-0",
				"transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring",
				isOwner
					? "opacity-50 cursor-not-allowed"
					: "cursor-pointer hover:bg-muted/40 active:scale-95",
			)}
		>
			<span aria-hidden>✨</span>
			<span>{optimisticState.count}</span>
		</button>
	);

	return isOwner ? (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className="inline-flex">{SparkInline}</span>
			</TooltipTrigger>
			<TooltipContent>You can't spark your own habit</TooltipContent>
		</Tooltip>
	) : (
		SparkInline
	);
}
