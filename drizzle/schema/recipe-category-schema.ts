import { sql } from "drizzle-orm";
import { pgPolicy, snakeCase, text, uuid } from "drizzle-orm/pg-core";
import { profileSchema } from "@/drizzle/schema/profile-schema";
import { createdAt, updatedAt } from "@/drizzle/schema/schema-commons";

export const recipeCategorySchema = snakeCase.table.withRLS(
	"recipe-category",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		createdAt,
		updatedAt,
		userId: uuid("user_id")
			.notNull()
			.references(() => profileSchema.id, { onDelete: "cascade" })
			.default(sql`auth
      .
      uid
      ()`),
		name: text().notNull(),
		color: text(),
	},
	(_table) => [
		pgPolicy("Users can manage their own recipe categories", {
			as: "permissive",
			for: "all",
			to: ["authenticated"],
			using: sql`(auth.uid() = user_id)`,
			withCheck: sql`(auth.uid() = user_id)`,
		}),
	],
);
