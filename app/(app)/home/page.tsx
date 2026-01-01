import { formatDate } from "date-fns";
import HabitsList from "@/components/habit/habits-list";
import { DateSelector } from "@/components/home/date-selector";

export default async function HomePage(props: {
	searchParams: Promise<{
		date?: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	const selectedDate =
		searchParams.date || new Date().toISOString().split("T")[0];

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
				<section>
					<h1 className="text-2xl font-bold">
						{formatDate(selectedDate, "EEEE, MMMM d")}
					</h1>
				</section>

				<section>
					<DateSelector />
				</section>

				<section>
					<HabitsList selectedDate={selectedDate} />
				</section>
			</div>
		</div>
	);
}
