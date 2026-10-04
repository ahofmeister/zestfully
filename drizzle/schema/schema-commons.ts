import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const id = uuid().defaultRandom().primaryKey().notNull();

export const createdAt = timestamp("created_at", {
	mode: "string",
	withTimezone: true,
})
	.notNull()
	.defaultNow();

export const updatedAt = timestamp("updated_at", {
	mode: "string",
	withTimezone: true,
})
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date().toISOString());

export const userId = uuid("user_id").default(sql`auth.uid()`).notNull();
