"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { BaseFormState } from "@/components/form-utils";
import { dbTransaction } from "@/drizzle/client";
import { milestones, type Visibility } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";

export async function deleteMilestone(milestoneId: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "Not authenticated" };
	}

	try {
		await dbTransaction((tx) =>
			tx.delete(milestones).where(eq(milestones.id, milestoneId)),
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
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

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

	console.log(name, description, color, visibility, startDate, celebrationsStr);

	if (!name || !color || !visibility) {
		return { error: "Required fields missing", success: false };
	}

	if (!isUpdate && !startDate) {
		return { error: "Start date required for new milestone", success: false };
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
					return {
						error: "Invalid celebration format",
						success: false,
					};
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
		celebrations,
	};

	try {
		if (isUpdate) {
			await dbTransaction((tx) =>
				tx
					.update(milestones)
					.set({
						...values,
						updatedAt: new Date(),
					})
					.where(
						and(eq(milestones.id, milestoneId), eq(milestones.userId, user.id)),
					),
			);
		} else {
			await dbTransaction((tx) =>
				tx.insert(milestones).values({
					...values,
					startDate: new Date(startDate),
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
