import { DateSelector } from "@/components/dashboard/date-selector";
import HabitsList from "@/components/habit/habits-list";

export default async function DashboardPage(props: {
	searchParams: Promise<{
		date?: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	const selectedDate =
		searchParams.date || new Date().toISOString().split("T")[0];

	return (
		<div className="mx-auto max-w-xl px-2">
			<div className="mb-8">
				<DateSelector />
			</div>

			<HabitsList selectedDate={selectedDate} />
		</div>
	);
}
