"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/drizzle/client";
import { profileSchema, sparkSchema } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";

export async function giveSpark(habitId: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "You must be logged in to give sparks" };
	}

	try {
		await dbTransaction(async (tx) => {
			const profile = await tx.query.profileSchema.findFirst({
				where: eq(profileSchema.userId, user.id),
			});

			if (!profile) {
				throw new Error("Profile not found");
			}

			await tx.insert(sparkSchema).values({
				profileId: profile.id,
				habitId,
			});
		});

		revalidatePath("/[username]");

		return { success: true };
	} catch (error) {
		console.error("Failed to give spark:", error);
		return {
			error: "Failed to give spark. You may have already sparked this habit.",
		};
	}
}

export async function removeSpark(habitId: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "You must be logged in to remove sparks" };
	}

	try {
		await dbTransaction(async (tx) => {
			const profile = await tx.query.profileSchema.findFirst({
				where: eq(profileSchema.userId, user.id),
			});

			if (!profile) {
				throw new Error("Profile not found");
			}

			await tx
				.delete(sparkSchema)
				.where(
					and(
						eq(sparkSchema.habitId, habitId),
						eq(sparkSchema.profileId, profile.id),
					),
				);
		});

		revalidatePath("/[username]");
		return { success: true };
	} catch (error) {
		console.error("Failed to remove spark:", error);
		return { error: "Failed to remove spark" };
	}
}

export async function getSparkCount(habitId: string): Promise<number> {
	try {
		const result = await dbTransaction(async (tx) => {
			return tx
				.select({ count: sql<number>`count(*)::int` })
				.from(sparkSchema)
				.where(eq(sparkSchema.habitId, habitId));
		});

		return result[0]?.count || 0;
	} catch (error) {
		console.error("Failed to get spark count:", error);
		return 0;
	}
}

export async function hasUserSparked(habitId: string): Promise<boolean> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return false;
	}

	try {
		return await dbTransaction(async (tx) => {
			const profile = await tx.query.profileSchema.findFirst({
				where: eq(profileSchema.userId, user.id),
			});

			if (!profile) {
				return false;
			}

			const spark = await tx.query.sparkSchema.findFirst({
				where: and(
					eq(sparkSchema.habitId, habitId),
					eq(sparkSchema.profileId, profile.id),
				),
			});

			return !!spark;
		});
	} catch (error) {
		console.error("Failed to check if user sparked:", error);
		return false;
	}
}
