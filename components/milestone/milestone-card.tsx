"use client";
import { differenceInDays, format } from "date-fns";
import { CheckIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import { deleteMilestone } from "@/components/milestone/milestone-actions";
import {
	calculateCelebrationDate,
	formatCelebration,
	sortCelebrations,
} from "@/components/milestone/milestone-celebration-calculator";
import MilestoneDrawer from "@/components/milestone/milestone-form";
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
	const today = new Date();
	const daysSince = differenceInDays(today, new Date(milestone.startDate));

	return (
		<div
			className="w-50 h-36 p-3 rounded-lg border hover:bg-secondary/50 transition-colors flex flex-col"
			style={{ borderColor: milestone.color }}
		>
			<div className={"flex justify-between items-center"}>
				<h3 className="font-mono text-xs font-semibold line-clamp-2 pr-6">
					{milestone.name}
				</h3>

				{isOwner && (
					<MilestoneDrawer milestone={milestone}>
						<SettingsIcon size={14} />
					</MilestoneDrawer>
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
				{sortCelebrations(milestone.celebrations || []).map(
					(celebration, index) => {
						const celebrationDate = calculateCelebrationDate(
							new Date(milestone.startDate),
							celebration,
						);
						const achieved = new Date() >= celebrationDate;
						const label = formatCelebration(celebration);

						return (
							<Tooltip key={index}>
								<TooltipTrigger asChild>
									<div
										className={cn(
											"h-4 w-4 rounded-sm flex items-center justify-center text-[8px] font-bold transition-all",
											achieved
												? "text-primary"
												: "bg-muted text-muted-foreground opacity-50",
										)}
									>
										{achieved ? <CheckIcon /> : celebration.value}
									</div>
								</TooltipTrigger>
								<TooltipContent>
									{achieved ? `Achieved ${label}` : `Celebrate at ${label}`}
								</TooltipContent>
							</Tooltip>
						);
					},
				)}
			</div>
		</div>
	);
}
