import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/app/auth/auth-actions";
import MilestoneCard from "@/components/milestone/milestone-card";
import { dbTransaction } from "@/drizzle/client";
import { milestoneSchema, profileSchema } from "@/drizzle/schema";

export default async function MilestonesList({
	username,
}: {
	username?: string;
}) {
	const user = await getCurrentUser();

	let targetUserId: string | undefined;

	if (username) {
		const profile = await dbTransaction(async (tx) => {
			return tx
				.select({ userId: profileSchema.userId })
				.from(profileSchema)
				.where(eq(profileSchema.username, username))
				.limit(1);
		});

		if (!profile[0]) {
			return (
				<div className="text-center py-12">
					<p className="text-muted-foreground text-sm">User not found.</p>
				</div>
			);
		}

		targetUserId = profile[0].userId;
	} else {
		targetUserId = user?.id;
	}

	if (!targetUserId) {
		return null;
	}

	const userMilestones = await dbTransaction((tx) => {
		return tx
			.select()
			.from(milestoneSchema)
			.where(eq(milestoneSchema.userId, targetUserId))
			.orderBy(desc(milestoneSchema.createdAt));
	});

	const isOwner = user?.id === targetUserId;

	if (!userMilestones.length) {
		return null;
	}

	return userMilestones.map((milestone) => (
		<MilestoneCard key={milestone.id} milestone={milestone} isOwner={isOwner} />
	));
}
