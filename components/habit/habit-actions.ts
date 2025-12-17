"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/drizzle/client";
import { habitCompletion, habitSchema } from "@/drizzle/schema";

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

export async function trackHabitDay(habitId: string, date: string) {
	try {
		await dbTransaction(async (tx) => {
			await tx
				.insert(habitCompletion)
				.values({
					habitId,
					completedAt: date,
				})
				.onConflictDoNothing();
		});

		revalidatePath("/habits");
		return { success: true };
	} catch (error) {
		console.error("Failed to track habit:", error);
		return { success: false, error: "Failed to track habit" };
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
				.set({ name: name.trim() })
				.where(eq(habitSchema.id, habitId));
		});

		revalidatePath("/habits");
		return { success: true };
	} catch (error) {
		console.error("Failed to rename habit:", error);
		return { error: "Failed to rename habit. Please try again." };
	}
}
