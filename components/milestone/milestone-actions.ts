"use server";

import { isSameDay, parseISO } from "date-fns";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/auth/auth-actions";
import type { BaseFormState } from "@/components/form-utils";
import {
	calculateCelebrationDate,
	formatCelebration,
} from "@/components/milestone/milestone-celebration-calculator";
import { dbTransaction } from "@/drizzle/client";
import { milestoneSchema, type Visibility } from "@/drizzle/schema";

export async function deleteMilestone(milestoneId: string) {
	const user = await getCurrentUser();
	if (!user) {
		return { error: "Not authenticated" };
	}

	try {
		await dbTransaction((tx) =>
			tx.delete(milestoneSchema).where(eq(milestoneSchema.id, milestoneId)),
		);
	} catch (error) {
		console.error(error);
		return { success: false, error: "Failed to delete milestone" };
	}

	revalidatePath("/");
	return { success: true };
}

export async function saveMilestone(
	_prev: BaseFormState,
	formData: FormData,
): Promise<BaseFormState> {
	const user = await getCurrentUser();

	if (!user) {
		return { error: "Not authenticated", success: false };
	}

	const milestoneId = formData.get("milestoneId") as string;
	const isUpdate = !!milestoneId;

	const name = formData.get("name") as string;
	const description = formData.get("description") as string;
	const color = formData.get("color") as string;
	const visibility = formData.get("visibility") as Visibility;
	const startDate = formData.get("startDate") as string;
	const celebrationsStr = formData.get("celebrations") as string;

	if (!name || !color || !visibility || !startDate) {
		return { error: "Required fields missing", success: false };
	}

	type Celebration = {
		value: number;
		unit: "days" | "weeks" | "months" | "years";
	};

	let celebrations: Celebration[] | null = null;

	if (celebrationsStr) {
		try {
			const parsed = JSON.parse(celebrationsStr);

			if (Array.isArray(parsed)) {
				const isValid = parsed.every(
					(c) =>
						typeof c === "object" &&
						typeof c.value === "number" &&
						c.value > 0 &&
						["days", "weeks", "months", "years"].includes(c.unit),
				);

				if (!isValid) {
					return { error: "Invalid celebration format", success: false };
				}

				celebrations = parsed.length > 0 ? parsed : null;
			}
		} catch {
			return { error: "Invalid celebrations format", success: false };
		}
	}

	const values = {
		name: name.trim(),
		description: description?.trim() || null,
		color,
		visibility,
		startDate: new Date(startDate),
		celebrations,
	};

	try {
		if (isUpdate) {
			await dbTransaction((tx) =>
				tx
					.update(milestoneSchema)
					.set({
						...values,
						updatedAt: new Date(),
					})
					.where(
						and(
							eq(milestoneSchema.id, milestoneId),
							eq(milestoneSchema.userId, user.id),
						),
					),
			);
		} else {
			await dbTransaction((tx) =>
				tx.insert(milestoneSchema).values({
					...values,
					userId: user.id,
				}),
			);
		}
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error: `Failed to ${isUpdate ? "update" : "create"} milestone`,
		};
	}

	revalidatePath("/");
	return { success: true };
}

type MilestoneWithCelebration = {
	milestone: typeof milestoneSchema.$inferSelect;
	celebratingToday: Array<{
		value: number;
		unit: "days" | "weeks" | "months" | "years";
		label: string;
	}>;
};

export async function getMilestonesWithCelebrations(
	userId: string,
	selectedDate: string,
): Promise<MilestoneWithCelebration[]> {
	const allMilestones = await dbTransaction(async (tx) => {
		return tx
			.select()
			.from(milestoneSchema)
			.where(eq(milestoneSchema.userId, userId));
	});

	console.log(
		"Debug - All milestones:",
		JSON.stringify(
			allMilestones.map((m) => ({
				name: m.name,
				startDate: m.startDate,
				celebrations: m.celebrations,
			})),
			null,
			2,
		),
	);

	const targetDate = parseISO(selectedDate);
	const results: MilestoneWithCelebration[] = [];

	for (const milestone of allMilestones) {
		if (!milestone.celebrations) {
			continue;
		}

		if (milestone.celebrations.length === 0) {
			continue;
		}

		const celebratingToday = milestone.celebrations.filter((celebration) => {
			const celebrationDate = calculateCelebrationDate(
				milestone.startDate,
				celebration,
			);

			console.log({
				milestone: milestone.name,
				celebration: celebration,
				startDate: milestone.startDate,
				calculatedDate: celebrationDate,
				targetDate: targetDate,
				matches: isSameDay(celebrationDate, targetDate),
			});

			return isSameDay(celebrationDate, targetDate);
		});

		if (celebratingToday.length > 0) {
			results.push({
				milestone,
				celebratingToday: celebratingToday.map((c) => ({
					...c,
					label: formatCelebration(c),
				})),
			});
		}
	}

	return results;
}
