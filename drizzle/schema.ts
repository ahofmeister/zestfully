import { sql } from "drizzle-orm";
import {
	check,
	date,
	index,
	pgEnum,
	pgPolicy,
	pgTable,
	real,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const mealTime = pgEnum("MealTime", [
	"breakfast",
	"lunch",
	"dinner",
	"snack",
]);
export const measurement = pgEnum("measurement", ["mass", "volume"]);

export const food = pgTable(
	"food",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(
				sql`timezone
        ('utc'::text, now())`,
			)
			.notNull(),
		name: text().notNull(),
		userId: uuid("user_id")
			.default(
				sql`auth
        .
        uid
        ()`,
			)
			.notNull(),
		energy: real().notNull(),
		protein: real().notNull(),
		fat: real().notNull(),
		carbohydrates: real().notNull(),
		sugar: real(),
		fibre: real(),
		salt: real(),
	},
	(table) => [
		pgPolicy("Authenticated users can insert their own food", {
			as: "permissive",
			for: "insert",
			to: ["authenticated"],
			withCheck: sql`(auth.uid()
                     = user_id)`,
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

export const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealType = (typeof mealTypes)[number];

export const mealItems = pgTable(
	"meal_items",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: uuid("user_id").notNull(),
		foodId: uuid("food_id")
			.notNull()
			.references(() => food.id, { onDelete: "cascade" }),
		date: date("date").notNull(),
		mealType: varchar("meal_type", { length: 20 }).$type<MealType>().notNull(),
		quantity: real("quantity").notNull(),
		unit: varchar("unit", { length: 20 }).notNull().default("g"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => {
		return [
			index("meal_items_date_idx").on(table.date),
			index("meal_items_user_id_idx").on(table.userId),
			check("quantity_positive", sql`${table.quantity} > 0`),

			pgPolicy("Users can view own meal items", {
				as: "permissive",
				for: "select",
				to: ["authenticated"],
				using: sql`auth.uid() = ${table.userId}`,
			}),

			pgPolicy("Users can insert own meal items", {
				as: "permissive",
				for: "insert",
				to: ["authenticated"],
				withCheck: sql`auth.uid() =${table.userId}`,
			}),
		];
	},
);
