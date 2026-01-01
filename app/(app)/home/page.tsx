import { PlusIcon } from "lucide-react";
import HabitsList from "@/components/habit/habits-list";
import { DateSelector } from "@/components/home/date-selector";
import MilestoneSettings from "@/components/milestone/milestone-settings";
import { Button } from "@/components/ui/button";

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
			<div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
				<section>
					<DateSelector />
				</section>

				<section>
					<HabitsList selectedDate={selectedDate} />
				</section>

				<section className="flex gap-3 justify-center pt-4">
					<MilestoneSettings>
						<Button variant="outline" size="lg" className="gap-2">
							<PlusIcon className="h-4 w-4" />
							Create Milestone
						</Button>
					</MilestoneSettings>
				</section>
			</div>
		</div>
	);
}
