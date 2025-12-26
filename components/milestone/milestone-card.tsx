"use client";
import { differenceInDays, format } from "date-fns";
import { CheckIcon, Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import { deleteMilestone } from "@/components/milestone/milestone-actions";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { milestones } from "@/drizzle/schema";
import { cn } from "@/lib/utils";

type Milestone = typeof milestones.$inferSelect;

export default function MilestoneCard({
	milestone,
	isOwner,
}: {
	milestone: Milestone;
	isOwner: boolean;
}) {
	const [isPending, startTransition] = useTransition();

	const today = new Date();
	const daysSince = differenceInDays(today, new Date(milestone.startDate));

	const handleDelete = async () => {
		if (!confirm(`Delete "${milestone.name}"? This cannot be undone.`)) {
			return;
		}

		startTransition(async () => {
			await deleteMilestone(milestone.id);
		});
	};

	return (
		<div
			className="w-50 h-36 p-3 rounded-lg border hover:bg-secondary/50 transition-colors flex flex-col"
			style={{ borderColor: milestone.color }}
		>
			<div className={"flex justify-between"}>
				<h3 className="font-mono text-xs font-semibold line-clamp-2 mb-2 pr-6">
					{milestone.name}
				</h3>

				{isOwner && (
					<Button
						className={"w-4 h-4"}
						variant="ghost"
						size="iconSm"
						onClick={handleDelete}
						disabled={isPending}
					>
						<Trash2Icon className={"size-3.5"} />
					</Button>
				)}
			</div>
			<div className="flex-1 flex flex-col items-center justify-center">
				<div
					className="text-2xl font-bold font-mono"
					style={{ color: milestone.color }}
				>
					{daysSince}
				</div>
				<div className="text-[10px] text-muted-foreground">
					{daysSince === 1 ? "day" : "days"}
				</div>
			</div>

			<div className="text-[10px] text-muted-foreground text-center mb-2">
				{format(new Date(milestone.startDate), "MMM d, yyyy")}
			</div>

			<div className="flex gap-1 justify-center">
				{milestone.celebrations.map((celebration) => {
					const achieved = daysSince >= celebration;
					return (
						<Tooltip key={celebration}>
							<TooltipTrigger asChild>
								<div
									key={celebration}
									className={cn(
										"h-4 w-4 rounded-sm flex items-center justify-center text-[8px] font-bold transition-all",
										achieved
											? "text-primary"
											: "bg-muted text-muted-foreground opacity-50",
									)}
								>
									{achieved ? <CheckIcon /> : celebration}
								</div>
							</TooltipTrigger>
							<TooltipContent>
								{achieved
									? `Achieved ${celebration} days`
									: `Celebrate at ${celebration} days`}
							</TooltipContent>
						</Tooltip>
					);
				})}
			</div>
		</div>
	);
}
