import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, real, text, uuid } from "drizzle-orm/pg-core";
import { profileSchema } from "@/drizzle/schema/profile-schema";
import { id } from "@/drizzle/schema/schema-commons";

export const foodSchema = pgTable(
	"food",
	{
		...id(),
		// ...timestamps(),
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
