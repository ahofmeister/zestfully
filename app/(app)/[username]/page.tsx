import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import HabitGrid from "@/components/habit/habit-grid";
import MilestonesList from "@/components/milestone/milestone-list";
import { dbTransaction } from "@/drizzle/client";
import { profileSchema } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";

export default async function ProfilePage(props: {
	params: Promise<{ username: string }>;
}) {
	const params = await props.params;
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const profile = await dbTransaction(async (tx) => {
		return (
			await tx
				.select()
				.from(profileSchema)
				.where(eq(profileSchema.username, params.username))
				.limit(1)
		)[0];
	});

	if (!profile) {
		notFound();
	}

	const isOwnProfile = user?.id === profile.userId;

	if (!profile.isPublic && !isOwnProfile) {
		return (
			<div className="container mx-auto max-w-2xl p-8">
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-bold">This profile is private</h1>
					<p className="text-muted-foreground">
						@{profile.username} has chosen to keep their profile private.
					</p>
				</div>
			</div>
		);
	}

	const habits = await dbTransaction(async (tx) => {
		return tx.query.habitSchema.findMany({
			where: (habit, { eq, and, or }) =>
				and(
					eq(habit.userId, profile.userId),
					isOwnProfile
						? undefined
						: or(
								eq(habit.visibility, "public"),
								user ? eq(habit.visibility, "members") : undefined,
							),
				),
			with: {
				completions: true,
				sparks: true,
			},
		});
	});

	return (
		<div className=" mx-auto max-w-[1105px]">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">{profile.username}</h1>
				{profile.bio && (
					<p className="text-muted-foreground mt-2">{profile.bio}</p>
				)}
			</div>

			<div className="space-y-6">
				<section className="flex flex-col gap-4 items-center md:flex-row">
					<MilestonesList username={profile.username} />
				</section>
				{habits.map((habit) => (
					<div key={habit.id}>
						<HabitGrid
							habit={habit}
							isOwner={isOwnProfile}
							sparkCount={habit.sparks.length}
							hasSparked={
								!!user && habit.sparks.some((s) => s.userId === user.id)
							}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
