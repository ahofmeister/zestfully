"use server";
import { ilike } from "drizzle-orm";
import { dbTransaction } from "@/drizzle/client";
import { foodSchema } from "@/drizzle/schema";

export async function searchFood(term: string) {
	return await dbTransaction((tx) => {
		return tx.query.foodSchema.findMany({ where: ilike(foodSchema.name, `%${term}%`) });
	});
}
