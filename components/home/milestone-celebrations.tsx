import { getMilestonesWithCelebrations } from "@/components/milestone/milestone-actions";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

export async function MilestoneCelebrations({
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

	const milestones = await getMilestonesWithCelebrations(user.id, selectedDate);

	if (milestones.length === 0) {
		return null;
	}

	return (
		<Card>
			<div className="p-4">
				<div className="flex items-center gap-2 mb-2">
					<span className="text-2xl">🎉</span>
					<h3 className="font-bold">Celebration Day!</h3>
				</div>
				<div className="space-y-2">
					{milestones.map((milestone) => (
						<div key={milestone.milestone.id} className="text-sm">
							<span>{milestone.milestone.name}</span> -{" "}
							{milestone.celebratingToday[0].label}
						</div>
					))}
				</div>
			</div>
		</Card>
	);
}
