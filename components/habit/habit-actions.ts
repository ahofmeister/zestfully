"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { BaseFormState } from "@/components/form-utils";
import { dbTransaction } from "@/drizzle/client";
import {
	type FrequencyType,
	habitCompletion,
	habitSchema,
	type Visibility,
	type Weekday,
} from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";

export async function toggleHabitCompletion(habitId: string, date: string) {
	try {
		await dbTransaction(async (tx) => {
			const existing = await tx
				.select()
				.from(habitCompletion)
				.where(
					and(
						eq(habitCompletion.habitId, habitId),
						eq(habitCompletion.completedAt, date),
					),
				)
				.limit(1);

			if (existing.length > 0) {
				await tx
					.delete(habitCompletion)
					.where(
						and(
							eq(habitCompletion.habitId, habitId),
							eq(habitCompletion.completedAt, date),
						),
					);
			} else {
				await tx.insert(habitCompletion).values({
					habitId,
					completedAt: date,
				});
			}
		});

		revalidatePath("/habits");
		return { success: true };
	} catch (error) {
		console.error("Failed to toggle completion:", error);
		return { success: false, error: "Failed to update habit" };
	}
}

export async function deleteHabit(habitId: string) {
	try {
		await dbTransaction(async (tx) => {
			await tx.delete(habitSchema).where(eq(habitSchema.id, habitId));
		});

		revalidatePath("/habits");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete habit:", error);
		return { success: false, error: "Failed to delete habit" };
	}
}

export async function renameHabit(
	_prevState: { success?: boolean; error?: string } | null,
	formData: FormData,
) {
	const habitId = formData.get("habitId") as string;
	const name = formData.get("name") as string;
	const color = formData.get("color") as string;

	if (!habitId || !name?.trim()) {
		return { error: "Habit name is required" };
	}

	if (name.trim().length > 100) {
		return { error: "Habit name must be less than 100 characters" };
	}

	try {
		await dbTransaction(async (tx) => {
			await tx
				.update(habitSchema)
				.set({ name: name.trim(), color })
				.where(eq(habitSchema.id, habitId));
		});

		revalidatePath("/habits");
		return { success: true };
	} catch (error) {
		console.error("Failed to rename habit:", error);
		return { error: "Failed to rename habit. Please try again." };
	}
}

export async function createHabit(
	_: BaseFormState,
	formData: FormData,
): Promise<BaseFormState> {
	const name = formData.get("name") as string;
	const color = formData.get("color") as string;

	if (!name || !color) {
		return { error: "Name and color are required", success: false };
	}

	await dbTransaction(async (tx) => {
		await tx.insert(habitSchema).values({
			name,
			color,
		});
	});

	revalidatePath("/");
	return { success: true };
}

export async function updateHabit(
	_: BaseFormState,
	formData: FormData,
): Promise<BaseFormState> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "Not authenticated", success: false };
	}

	const habitId = formData.get("habitId") as string;
	const name = formData.get("name") as string;
	const color = formData.get("color") as string;
	const visibility = formData.get("visibility") as Visibility;
	const frequencyType = formData.get("frequencyType") as FrequencyType;
	const frequencyTarget = formData.get("frequencyTarget") as string;
	const frequencyDays = formData.getAll("frequencyDays") as Weekday[];

	if (!habitId || !name || !color) {
		return { error: "Required fields missing", success: false };
	}

	try {
		await dbTransaction(async (tx) => {
			await tx
				.update(habitSchema)
				.set({
					name: name.trim(),
					color,
					visibility,
					frequencyType,
					frequencyDays,
					frequencyTarget: frequencyTarget
						? parseInt(frequencyTarget, 10)
						: null,
					updatedAt: new Date(),
				})
				.where(eq(habitSchema.id, habitId));
		});

		revalidatePath("/");
		return { success: true };
	} catch (error) {
		console.error("Error updating habit:", error);
		return { error: "Failed to update habit", success: false };
	}
}
