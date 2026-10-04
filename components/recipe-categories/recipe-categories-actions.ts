"use server";
import { eq } from "drizzle-orm";
import { dbTransaction } from "@/drizzle/client";
import { recipeCategorySchema, type recipeSchema } from "@/drizzle/schema";

export async function createRecipeCategory(
	category: typeof recipeSchema.$inferInsert | typeof recipeSchema.$inferSelect,
) {
	return await dbTransaction(async (tx) => {
		category.id !== undefined
			? await tx
					.update(recipeCategorySchema)
					.set(category)
					.where(eq(recipeCategorySchema.id, category.id))
					.returning()
			: await tx.insert(recipeCategorySchema).values(category).returning();
	});
}
