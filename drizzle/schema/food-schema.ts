import { sql } from "drizzle-orm";
import { pgPolicy, real, snakeCase, text, uuid } from "drizzle-orm/pg-core";
import { profileSchema } from "@/drizzle/schema/profile-schema";

export type Nutrients = Pick<
	typeof foodSchema.$inferSelect,
	"energy" | "protein" | "fat" | "carbohydrates"
> &
	Partial<Pick<typeof foodSchema.$inferSelect, "sugar" | "fibre" | "salt">>;

export type QuantifiedNutrients = {
	quantity: number;
	nutrients: Nutrients;
};

export const foodSchema = snakeCase.table.withRLS(
	"food",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		userId: uuid("user_id")
			.notNull()
			.references(() => profileSchema.id, { onDelete: "cascade" })
			.default(sql`auth.uid()`),
		name: text().notNull(),
		energy: real().notNull(),
		protein: real().notNull(),
		fat: real().notNull(),
		carbohydrates: real().notNull(),
		sugar: real(),
		fibre: real(),
		salt: real(),
	},
	(_table) => [
		pgPolicy("Authenticated users can insert their own food", {
			as: "permissive",
			for: "insert",
			to: ["authenticated"],
			withCheck: sql`(auth.uid() = user_id)`,
		}),
		pgPolicy("Enable delete for users based on user_id", {
			as: "permissive",
			for: "delete",
			to: ["public"],
		}),
		pgPolicy("User can only select their own foods", {
			as: "permissive",
			for: "select",
			to: ["authenticated"],
		}),
	],
);
