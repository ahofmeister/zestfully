import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import HabitGrid from "@/components/habit/habit-grid";
import { dbTransaction } from "@/drizzle/client";
import { habitSchema } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";

const HabitsPage = async () => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/sign-in");
	}

	const habits = await dbTransaction(async (tx) => {
		return tx.query.habitSchema.findMany({
			where: eq(habitSchema.userId, user.id),
			with: {
				completions: true,
				sparks: true,
			},
		});
	});

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-8">
			{habits.map((habit) => (
				<HabitGrid
					key={habit.id}
					habit={habit}
					isOwner={true}
					sparkCount={habit.sparks.length}
					hasSparked={false}
				/>
			))}
		</div>
	);
};

export default HabitsPage;
