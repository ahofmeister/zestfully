import { eq } from "drizzle-orm";
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

	const habits = await dbTransaction((tx) =>
		tx.query.habitSchema.findMany({
			where: eq(habitSchema.userId, user.id),
			with: {
				completions: true,
			},
		}),
	);

	return <DayHabits habits={habits} selectedDate={selectedDate} />;
}
