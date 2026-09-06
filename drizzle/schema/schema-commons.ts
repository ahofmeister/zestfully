import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";
import { profileSchema } from "@/drizzle/schema/profile-schema";

export const id = () => ({
	id: uuid("id").primaryKey().defaultRandom().notNull(),
});

export const timestamps = () => ({
	createdAt: timestamp("created_at", {
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),

	updatedAt: timestamp("updated_at", {
		withTimezone: true,
	})
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const userId = () => ({
	userId: uuid("user_id")
		.notNull()
		.references(() => profileSchema.id, { onDelete: "cascade" })
		.default(sql`auth.uid()`),
});
