"use client";

import { Check, Globe, Lock, Users } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { updateHabitVisibility } from "@/components/habit/habit-actions";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Visibility } from "@/drizzle/schema";

const VISIBILITY_CONFIG = [
	{
		value: "public" as const,
		icon: Globe,
		label: "Public",
		description: "Everyone can see",
	},
	{
		value: "members" as const,
		icon: Users,
		label: "Members only",
		description: "Logged-in users",
	},
	{
		value: "private" as const,
		icon: Lock,
		label: "Private",
		description: "Only you",
	},
] as const;

export function HabitVisibility({
	habitId,
	visibility,
}: {
	habitId: string;
	visibility: Visibility;
}) {
	const [isPending, startTransition] = useTransition();
	const [optimisticVisibility, setOptimisticVisibility] = useOptimistic(
		visibility,
		(_, newVisibility: Visibility) => newVisibility,
	);

	const current =
		VISIBILITY_CONFIG.find((v) => v.value === optimisticVisibility) ??
		VISIBILITY_CONFIG[2];
	const { icon: Icon, label } = current;

	const handleChange = (newVisibility: Visibility) => {
		startTransition(async () => {
			setOptimisticVisibility(newVisibility);
			await updateHabitVisibility(habitId, newVisibility);
		});
	};

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<DropdownMenu>
					<DropdownMenuTrigger disabled={isPending}>
						<Icon className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-accent" />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{VISIBILITY_CONFIG.map(({ value, icon: MenuIcon, label }) => (
							<DropdownMenuItem key={value} onClick={() => handleChange(value)}>
								<MenuIcon className="mr-2 h-4 w-4" />
								{label}
								{optimisticVisibility === value && (
									<Check className="ml-auto h-4 w-4" />
								)}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</TooltipTrigger>
			<TooltipContent>
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	);
}
