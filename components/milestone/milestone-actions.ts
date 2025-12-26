"use server";

import { eq } from "drizzle-orm";
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

export async function createMilestone(
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

	const name = formData.get("name") as string;
	const description = formData.get("description") as string;
	const color = formData.get("color") as string;
	const visibility = formData.get("visibility") as Visibility;
	const startDate = formData.get("startDate") as string;
	const celebrationsStr = formData.get("celebrations") as string;

	if (!name || !color || !startDate || !visibility) {
		return { error: "Required fields missing", success: false };
	}

	let celebrations: number[] = [];
	try {
		celebrations = JSON.parse(celebrationsStr);
		if (!Array.isArray(celebrations) || celebrations.length === 0) {
			return {
				error: "At least one celebration milestone required",
				success: false,
			};
		}
	} catch {
		return { error: "Invalid celebrations format", success: false };
	}

	try {
		await dbTransaction((tx) =>
			tx.insert(milestones).values({
				userId: user.id,
				name: name.trim(),
				description: description?.trim() || null,
				color,
				visibility,
				startDate: new Date(startDate),
				celebrations,
			}),
		);
	} catch (error) {
		console.error(error);
		return { success: false, error: "Failed to create milestone" };
	}

	revalidatePath("/");
	return { success: true };
}
