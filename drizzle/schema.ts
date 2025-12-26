import { relations, sql } from "drizzle-orm";
import {
	boolean,
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

export const VISIBILITY_TYPES = ["private", "members", "public"] as const;
export type Visibility = (typeof VISIBILITY_TYPES)[number];

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
		userId: uuid("user_id")
			.default(
				sql`auth.
        uid
        ()`,
			)
			.notNull(),
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
		visibility: text("visibility", { enum: VISIBILITY_TYPES })
			.notNull()
			.default("private"),
	},
	(table) => [
		index("habits_user_id_idx").on(table.userId),
		index("habits_user_created_idx").on(table.userId, table.createdAt),
		pgPolicy("users_view_own_habits", {
			as: "permissive",
			for: "select",
			to: "authenticated",
			using: sql`user_id = auth.uid()`,
		}),
		pgPolicy("users_view_public_habits", {
			as: "permissive",
			for: "select",
			to: "public",
			using: sql`visibility = 'public'`,
		}),
		pgPolicy("members_view_member_habits", {
			as: "permissive",
			for: "select",
			to: "authenticated",
			using: sql`visibility = 'members'`,
		}),
		pgPolicy("users_insert_own_habits", {
			as: "permissive",
			for: "insert",
			to: "authenticated",
			withCheck: sql`user_id = auth.uid()`,
		}),
		pgPolicy("users_update_own_habits", {
			as: "permissive",
			for: "update",
			to: "authenticated",
			using: sql`user_id = auth.uid()`,
			withCheck: sql`user_id = auth.uid()`,
		}),
		pgPolicy("users_delete_own_habits", {
			as: "permissive",
			for: "delete",
			to: "authenticated",
			using: sql`user_id = auth.uid()`,
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
		pgPolicy("users_view_public_completions", {
			as: "permissive",
			for: "select",
			to: "public",
			using: sql`EXISTS (
    SELECT 1 FROM habit 
    WHERE habit.id = habit_id 
    AND habit.visibility = 'public'
  )`,
		}),
		pgPolicy("members_view_member_completions", {
			as: "permissive",
			for: "select",
			to: "authenticated",
			using: sql`EXISTS (
    SELECT 1 FROM habit 
    WHERE habit.id = habit_id 
    AND habit.visibility = 'members'
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

export const profileSchema = pgTable(
	"profile",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: uuid("user_id").notNull().unique(),
		username: text("username").notNull().unique(),
		bio: text("bio"),
		isPublic: boolean("is_public").notNull().default(false),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		index("profile_username_idx").on(table.username),
		index("profile_user_id_idx").on(table.userId),
		check(
			"username_length",
			sql`char_length(${table.username}) >= 3 AND char_length(${table.username}) <= 20`,
		),
		check("username_format", sql`${table.username} ~ '^[a-zA-Z0-9_-]+$'`),
		check(
			"bio_length",
			sql`${table.bio} IS NULL OR char_length(${table.bio}) <= 200`,
		),
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

export const sparkSchema = pgTable(
	"spark",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: uuid("user_id")
			.notNull()
			.references(() => profileSchema.id, { onDelete: "cascade" }),
		habitId: uuid("habit_id")
			.notNull()
			.references(() => habitSchema.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		unique("spark_profile_habit_unique").on(table.habitId, table.userId),
		index("spark_habit_id_idx").on(table.habitId),
		index("spark_user_id_idx").on(table.userId),
		pgPolicy("users_insert_own_sparks", {
			as: "permissive",
			for: "insert",
			to: "authenticated",
			withCheck: sql`user_id = auth.uid()`,
		}),
		pgPolicy("users_view_all_sparks", {
			as: "permissive",
			for: "select",
			to: "public",
			using: sql`true`,
		}),
		pgPolicy("users_delete_own_sparks", {
			as: "permissive",
			for: "delete",
			to: "authenticated",
			withCheck: sql`user_id = auth.uid()`,
		}),
	],
).enableRLS();

export const habitRelations = relations(habitSchema, ({ many }) => ({
	completions: many(habitCompletion),
	sparks: many(sparkSchema),
}));

export const sparkRelations = relations(sparkSchema, ({ one }) => ({
	habit: one(habitSchema, {
		fields: [sparkSchema.habitId],
		references: [habitSchema.id],
	}),
	profile: one(profileSchema, {
		fields: [sparkSchema.userId],
		references: [profileSchema.id],
	}),
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

export const milestones = pgTable(
	"milestone",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: uuid("user_id").default(sql`auth.uid()`).notNull(),
		name: text("name").notNull(),
		description: text("description"),
		color: text("color").default("#10b981").notNull(),
		visibility: text("visibility")
			.$type<Visibility>()
			.notNull()
			.default("private"),
		startDate: timestamp("start_date").notNull(),
		resetAt: timestamp("reset_at"),
		celebrations: integer("celebrations")
			.array()
			.default([7, 30, 100, 365])
			.notNull(),
		resetCount: integer("reset_count").default(0).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		index("milestones_user_id_idx").on(table.userId),
		index("milestones_visibility_idx").on(table.visibility),

		pgPolicy("users_view_own_milestones", {
			as: "permissive",
			for: "select",
			to: "authenticated",
			using: sql`user_id = auth.uid()`,
		}),
		pgPolicy("users_view_public_milestones", {
			as: "permissive",
			for: "select",
			to: "public",
			using: sql`visibility = 'public'`,
		}),

		pgPolicy("users_insert_own_milestones", {
			as: "permissive",
			for: "insert",
			to: "authenticated",
			withCheck: sql`user_id = auth.uid()`,
		}),

		pgPolicy("users_update_own_milestones", {
			as: "permissive",
			for: "update",
			to: "authenticated",
			using: sql`user_id = auth.uid()`,
			withCheck: sql`user_id = auth.uid()`,
		}),

		pgPolicy("users_delete_own_milestones", {
			as: "permissive",
			for: "delete",
			to: "authenticated",
			using: sql`user_id = auth.uid()`,
		}),
	],
).enableRLS();
