import { and, eq, or, sql } from "drizzle-orm";
import { dbTransaction } from "@/drizzle/client";
import { habitSchema } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";
import DayHabits from "./day-habits";

export default async function HabitsList({
	selectedDate,
}: {
	selectedDate: string;
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	const weekday = new Date(selectedDate)
		.toLocaleDateString("en-US", { weekday: "short" })
		.toLowerCase();

	const habits = await dbTransaction((tx) =>
		tx.query.habitSchema.findMany({
			where: and(
				eq(habitSchema.userId, user.id),
				or(
					eq(habitSchema.frequencyType, "daily"),
					eq(habitSchema.frequencyType, "per_week"),
					and(
						eq(habitSchema.frequencyType, "scheduled_days"),
						sql`${habitSchema.frequencyDays} @> ARRAY[${weekday}]::text[]`,
					),
				),
			),

			with: {
				completions: true,
			},
		}),
	);

	return <DayHabits habits={habits} selectedDate={selectedDate} />;
}
