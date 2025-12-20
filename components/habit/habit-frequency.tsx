import type React from "react";
import { capitalize } from "@/components/strings";
import type { habitSchema } from "@/drizzle/schema";

export const HabitFrequency: React.FC<{
	habit: typeof habitSchema.$inferSelect;
}> = ({ habit }) => {
	let text = "";

	switch (habit.frequencyType) {
		case "daily":
			text = "Daily";
			break;
		case "per_week":
			text = habit.frequencyTarget
				? `${habit.frequencyTarget}× per week`
				: "Weekly";
			break;
		case "scheduled_days":
			text = habit.frequencyDays?.map((d) => capitalize(d)).join(", ") || "";
			break;
	}

	return <div className="text-xs text-muted-foreground font-mono">{text}</div>;
};
