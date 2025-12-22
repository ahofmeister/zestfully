import { Globe, Lock, Users } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Visibility } from "@/drizzle/schema";

export function HabitVisibility({ visibility }: { visibility: Visibility }) {
	const config = {
		public: { icon: Globe, label: "Public - Everyone can see" },
		members: { icon: Users, label: "Members only - Logged-in users" },
		private: { icon: Lock, label: "Private - Only you" },
	};

	const { icon: Icon, label } = config[visibility];

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Icon className="h-3 w-3 text-muted-foreground" />
				</TooltipTrigger>
				<TooltipContent>
					<p>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
