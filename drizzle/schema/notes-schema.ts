import { sql } from "drizzle-orm";
import { date, index, pgPolicy, snakeCase, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt, userId } from "./schema-commons";

export const noteSchema = snakeCase.table.withRLS(
	"note",
	{
		id,
		createdAt,
		updatedAt,
		userId,
		text: text().notNull(),
		date: date({ mode: "date" }).notNull().defaultNow(),
	},
	(table) => [
		index("note_user_id_idx").on(table.userId),
		pgPolicy("users_manage_own_notes", {
			as: "permissive",
			for: "all",
			to: "authenticated",
			using: sql`user_id = (select auth.uid())`,
			withCheck: sql`user_id = (select auth.uid())`,
		}),
	],
);
