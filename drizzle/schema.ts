import { relations, sql } from "drizzle-orm";
import {
	check,
	date,
	index,
	integer,
	pgPolicy,
	pgTable,
	real,
	text,
	timestamp,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const WEEKDAYS = [
	"mon",
	"tue",
	"wed",
	"thu",
	"fri",
	"sat",
	"sun",
] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const FREQUENCY_TYPES = ["daily", "per_week", "scheduled_days"] as const;
export type FrequencyType = (typeof FREQUENCY_TYPES)[number];

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
	(_table) => [
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
		userId: uuid("user_id")
			.default(
				sql`auth
        .
        uid
        ()`,
			)
			.notNull(),
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

export const habitSchema = pgTable(
	"habit",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: uuid("user_id").notNull(),
		name: text("name").notNull(),
		frequencyType: text("frequency_type")
			.$type<FrequencyType>()
			.notNull()
			.default("daily"),
		frequencyTarget: integer("frequency_target"),
		frequencyDays: text("frequency_days").array().$type<Weekday[]>(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		color: text("color").default("#10b981").notNull(),
	},
	(table) => [
		index("habits_user_id_idx").on(table.userId),
		index("habits_user_created_idx").on(table.userId, table.createdAt),
		pgPolicy("users_view_own_habits", {
			as: "permissive",
			for: "select",
			to: "authenticated",
			using: sql`auth.uid() = user_id`,
		}),
		pgPolicy("users_insert_own_habits", {
			as: "permissive",
			for: "insert",
			to: "authenticated",
			withCheck: sql`auth.uid() = user_id`,
		}),
		pgPolicy("users_update_own_habits", {
			as: "permissive",
			for: "update",
			to: "authenticated",
			using: sql`auth.uid() = user_id`,
		}),
		pgPolicy("users_delete_own_habits", {
			as: "permissive",
			for: "delete",
			to: "authenticated",
			using: sql`auth.uid() = user_id`,
		}),
	],
).enableRLS();

export const habitCompletion = pgTable(
	"habit_completions",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		habitId: uuid("habit_id")
			.notNull()
			.references(() => habitSchema.id, { onDelete: "cascade" }),
		completedAt: date("completed_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("habit_completions_habit_id_idx").on(table.habitId),
		index("habit_completions_completed_at_idx").on(table.completedAt),
		unique("habit_completion_unique").on(table.habitId, table.completedAt),
		pgPolicy("users_view_own_completions", {
			as: "permissive",
			for: "select",
			to: "authenticated",
			using: sql`EXISTS (
        SELECT 1 FROM habit 
        WHERE habit.id = habit_id 
        AND habit.user_id = auth.uid()
      )`,
		}),
		pgPolicy("users_insert_own_completions", {
			as: "permissive",
			for: "insert",
			to: "authenticated",
			withCheck: sql`EXISTS (
        SELECT 1 FROM habit 
        WHERE habit.id = habit_id 
        AND habit.user_id = auth.uid()
      )`,
		}),
		pgPolicy("users_delete_own_completions", {
			as: "permissive",
			for: "delete",
			to: "authenticated",
			using: sql`EXISTS (
        SELECT 1 FROM habit 
        WHERE habit.id = habit_id 
        AND habit.user_id = auth.uid()
      )`,
		}),
	],
).enableRLS();

export const habitRelations = relations(habitSchema, ({ many }) => ({
	completions: many(habitCompletion),
}));

export const habitCompletionRelations = relations(
	habitCompletion,
	({ one }) => ({
		habit: one(habitSchema, {
			fields: [habitCompletion.habitId],
			references: [habitSchema.id],
		}),
	}),
);
