import HabitGrid from "@/components/habit/habit-grid";
import { dbTransaction } from "@/drizzle/client";

const HabitsPage = async () => {
	const habits = await dbTransaction(async (tx) => {
		return tx.query.habitSchema.findMany({
			with: {
				completions: true,
			},
		});
	});

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-8">
			{habits.map((habit) => (
				<HabitGrid key={habit.id} habit={habit} />
			))}
		</div>
	);
};

export default HabitsPage;
