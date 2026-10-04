"use server";

import { dbTransaction } from "@/drizzle/client";

export async function searchFood(term: string) {
	return dbTransaction((tx) =>
		tx.query.foodSchema.findMany({
			where: {
				name: {
					ilike: `%${term}%`,
				},
			},
		}),
	);
}
