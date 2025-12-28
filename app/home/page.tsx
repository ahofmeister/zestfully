import { DateSelector } from "@/components/dashboard/date-selector";
import HabitsList from "@/components/habit/habits-list";
import MilestoneSettings from "@/components/milestone/milestone-settings";
import { Button } from "@/components/ui/button";

export default async function DashboardPage(props: {
	searchParams: Promise<{
		date?: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	const selectedDate =
		searchParams.date || new Date().toISOString().split("T")[0];

	return (
		<div className="mx-auto max-w-xl px-2 space-y-6">
			<div className="mb-8">
				<DateSelector />
			</div>

			<section>
				<HabitsList selectedDate={selectedDate} />
			</section>

			<section>
				<MilestoneSettings>
					<Button>Create Milestone</Button>
				</MilestoneSettings>
			</section>
		</div>
	);
}
