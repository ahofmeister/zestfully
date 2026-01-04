import { eq } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { getCurrentUser } from "@/app/auth/auth-actions";
import MilestoneCard from "@/components/milestone/milestone-card";
import MilestoneSettings from "@/components/milestone/milestone-settings";
import { Button } from "@/components/ui/button";
import { dbTransaction } from "@/drizzle/client";
import { milestoneSchema } from "@/drizzle/schema";

const MilestonesPage = async () => {
	const user = await getCurrentUser();

	if (!user) {
		return null;
	}

	const milestones = await dbTransaction((tx) => {
		return tx
			.select()
			.from(milestoneSchema)
			.where(eq(milestoneSchema.userId, user?.id));
	});

	return (
		<div className={"space-y-4"}>
			<div>
				<MilestoneSettings>
					<Button variant="default" size="sm" className="gap-1.5">
						<PlusIcon className="h-4 w-4" />
						New Habit
					</Button>
				</MilestoneSettings>
			</div>
			<div className={"flex gap-x-2"}>
				{milestones.map((milestone) => {
					return (
						<MilestoneCard
							key={milestone.id}
							milestone={milestone}
							isOwner={true}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default MilestonesPage;
