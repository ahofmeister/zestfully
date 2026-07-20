import { sql } from "drizzle-orm";
import { boolean, check, index, pgPolicy, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { id, timestamps } from "./schema-commons";

export const profileSchema = pgTable(
	"profile",
	{
		...id(),
		...timestamps(),
		userId: uuid("user_id").notNull().unique(),
		username: text("username").notNull().unique(),
		bio: text("bio"),
		isPublic: boolean("is_public").notNull().default(false),
	},
	(table) => [
		index("profile_username_idx").on(table.username),
		index("profile_user_id_idx").on(table.userId),
		check(
			"username_length",
			sql`char_length(${table.username}) >= 3 AND char_length(${table.username}) <= 20`,
		),
		check("username_format", sql`${table.username} ~ '^[a-zA-Z0-9_-]+$'`),
		check("bio_length", sql`${table.bio} IS NULL OR char_length(${table.bio}) <= 200`),
		pgPolicy("users_view_own_profile", {
			as: "permissive",
			for: "select",
			to: "authenticated",
			using: sql`user_id = auth.uid()`,
		}),
		pgPolicy("users_view_public_profiles", {
			as: "permissive",
			for: "select",
			to: "public",
			using: sql`is_public = true`,
		}),
		pgPolicy("users_update_own_profile", {
			as: "permissive",
			for: "update",
			to: "authenticated",
			using: sql`user_id = auth.uid()`,
			withCheck: sql`user_id = auth.uid()`,
		}),
	],
).enableRLS();
