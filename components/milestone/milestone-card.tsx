"use client";
import { differenceInDays, format } from "date-fns";
import { SettingsIcon } from "lucide-react";
import {
	calculateCelebrationDate,
	formatCelebration,
	sortCelebrations,
} from "@/components/milestone/milestone-celebration-calculator";
import MilestoneDrawer from "@/components/milestone/milestone-settings";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { milestoneSchema } from "@/drizzle/schema";

type Milestone = typeof milestoneSchema.$inferSelect;

export default function MilestoneCard({
	milestone,
	isOwner,
}: {
	milestone: Milestone;
	isOwner: boolean;
}) {
	const today = new Date();
	const daysSince = differenceInDays(today, new Date(milestone.startDate));

	const sortedCelebrations = sortCelebrations(milestone.celebrations || []);

	let achievedCount = 0;
	const totalCount = sortedCelebrations.length;
	let nextUpcoming = null;

	for (const celebration of sortedCelebrations) {
		const celebrationDate = calculateCelebrationDate(
			new Date(milestone.startDate),
			celebration,
		);
		const achieved = new Date() >= celebrationDate;

		if (achieved) {
			achievedCount++;
		} else if (!nextUpcoming) {
			nextUpcoming = { celebration, date: celebrationDate };
		}
	}

	const daysToNext = nextUpcoming
		? differenceInDays(nextUpcoming.date, today)
		: null;

	return (
		<div className="relative overflow-hidden w-full h-[180px]">
			<div
				className="absolute top-0 left-0 right-0 h-1"
				style={{ backgroundColor: milestone.color }}
			/>

			<div className="bg-card border border-border rounded-lg p-3 pt-4 hover:border-muted-foreground/30 transition-all h-full flex flex-col">
				<div className="flex items-start justify-between gap-2 mb-3 min-h-[44px]">
					<div className="flex-1 min-w-0">
						<h3 className="font-bold text-base leading-tight line-clamp-2 mb-1">
							{milestone.name}
						</h3>
						<div className="text-[10px] text-muted-foreground">
							{format(new Date(milestone.startDate), "MMM d, yyyy")}
						</div>
					</div>

					{isOwner && (
						<MilestoneDrawer milestone={milestone}>
							<Button variant="ghost" size="iconSm" className="shrink-0">
								<SettingsIcon className="size-3 text-muted-foreground" />
							</Button>
						</MilestoneDrawer>
					)}
				</div>

				<div className="mb-3 flex-1 flex flex-col justify-center">
					<div
						className="text-2xl font-black tabular-nums leading-none"
						style={{ color: milestone.color }}
					>
						{Math.max(daysSince, 0).toLocaleString()}
					</div>
					<div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
						{daysSince === 1 ? "day" : "days"}
					</div>
				</div>

				<div className="min-h-[20px]">
					{nextUpcoming && (
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									type="button"
									className="flex items-center gap-1.5 text-xs text-left w-full"
								>
									<span>🎉</span>
									<span className="font-semibold">
										{formatCelebration(nextUpcoming.celebration)}
									</span>
									<span className="text-muted-foreground">
										in {daysToNext}d
									</span>
								</button>
							</TooltipTrigger>
							<TooltipContent>
								{daysToNext} {daysToNext === 1 ? "day" : "days"} until{" "}
								{formatCelebration(nextUpcoming.celebration)}
							</TooltipContent>
						</Tooltip>
					)}

					{achievedCount === totalCount && totalCount > 0 && !nextUpcoming && (
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<span>🎉</span>
							<span>All milestones achieved</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
