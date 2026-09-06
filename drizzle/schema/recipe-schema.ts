import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, real, text } from "drizzle-orm/pg-core";
import { id, timestamps, userId } from "@/drizzle/schema/schema-commons";

export const recipeSchema = pgTable(
	"recipe",
	{
		...id(),
		...timestamps(),
		...userId(),
		name: text().notNull(),
		instructions: text(),
		servings: real().notNull().default(1),
	},
	(_table) => [
		pgPolicy("Users can manage their own recipes", {
			as: "permissive",
			for: "all",
			to: ["authenticated"],
			using: sql`(auth.uid() = user_id)`,
			withCheck: sql`(auth.uid() = user_id)`,
		}),
	],
).enableRLS();
