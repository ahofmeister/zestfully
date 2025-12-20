import { addDays, format, startOfWeek, subDays } from "date-fns";
import { describe, expect, it, vi } from "vitest";
import { calculateCurrentStreak } from "@/components/habit/streak-calculator";
import type { Weekday } from "@/drizzle/schema";

describe("calculateCurrentStreak - daily", () => {
	const getTodayString = () => format(new Date(), "yyyy-MM-dd");
	const daysAgoString = (days: number) =>
		format(subDays(new Date(), days), "yyyy-MM-dd");

	it("returns 0 for no completions", () => {
		const result = calculateCurrentStreak({
			completions: [],
			frequencyType: "daily",
		});
		expect(result).toBe(0);
	});

	it("returns 1 for completion today only", () => {
		const result = calculateCurrentStreak({
			completions: [getTodayString()],
			frequencyType: "daily",
		});
		expect(result).toBe(1);
	});

	it("returns 1 for completion yesterday only", () => {
		const result = calculateCurrentStreak({
			completions: [daysAgoString(1)],
			frequencyType: "daily",
		});
		expect(result).toBe(1);
	});

	it("returns 0 for completion 2 days ago (streak broken)", () => {
		const result = calculateCurrentStreak({
			completions: [daysAgoString(2)],
			frequencyType: "daily",
		});
		expect(result).toBe(0);
	});

	it("returns 3 for consecutive 3 days including today", () => {
		const result = calculateCurrentStreak({
			completions: [getTodayString(), daysAgoString(1), daysAgoString(2)],
			frequencyType: "daily",
		});
		expect(result).toBe(3);
	});

	it("returns 3 for consecutive 3 days including yesterday", () => {
		const result = calculateCurrentStreak({
			completions: [daysAgoString(1), daysAgoString(2), daysAgoString(3)],
			frequencyType: "daily",
		});
		expect(result).toBe(3);
	});

	it("returns 2 for today and yesterday, ignoring older gap", () => {
		const result = calculateCurrentStreak({
			completions: [
				getTodayString(),
				daysAgoString(1),
				daysAgoString(5),
				daysAgoString(6),
			],
			frequencyType: "daily",
		});
		expect(result).toBe(2);
	});

	it("handles unordered completions", () => {
		const result = calculateCurrentStreak({
			completions: [daysAgoString(2), getTodayString(), daysAgoString(1)],
			frequencyType: "daily",
		});
		expect(result).toBe(3);
	});
});

describe("calculateCurrentStreak - per_week", () => {
	const getTodayString = () => format(new Date(), "yyyy-MM-dd");
	const daysAgoString = (days: number) =>
		format(subDays(new Date(), days), "yyyy-MM-dd");

	const getWeekDate = (weeksAgo: number, dayOffset: number) => {
		const weekStart = startOfWeek(subDays(new Date(), weeksAgo * 7), {
			weekStartsOn: 1,
		});
		return format(addDays(weekStart, dayOffset), "yyyy-MM-dd");
	};

	it("returns 0 for no completions", () => {
		const result = calculateCurrentStreak({
			completions: [],
			frequencyType: "per_week",
			frequencyTarget: 3,
		});
		expect(result).toBe(0);
	});

	it("returns 0 when target not met in current or previous week", () => {
		const result = calculateCurrentStreak({
			completions: [getTodayString(), daysAgoString(2)],
			frequencyType: "per_week",
			frequencyTarget: 3,
		});
		expect(result).toBe(0);
	});

	it("returns 1 week when target met in current week only", () => {
		const completions = [
			getWeekDate(0, 0),
			getWeekDate(0, 2),
			getWeekDate(0, 4),
		];
		const result = calculateCurrentStreak({
			completions,
			frequencyType: "per_week",
			frequencyTarget: 3,
		});
		expect(result).toBe(1);
	});

	it("returns 2 weeks for consecutive weeks meeting target", () => {
		const completions = [
			getWeekDate(0, 0),
			getWeekDate(0, 2),
			getWeekDate(0, 4),
			getWeekDate(1, 0),
			getWeekDate(1, 2),
			getWeekDate(1, 4),
		];
		const result = calculateCurrentStreak({
			completions,
			frequencyType: "per_week",
			frequencyTarget: 3,
		});
		expect(result).toBe(2);
	});

	it("returns 1 when target met last week but not current week", () => {
		const completions = [
			getTodayString(),
			getWeekDate(1, 0),
			getWeekDate(1, 2),
			getWeekDate(1, 4),
		];
		const result = calculateCurrentStreak({
			completions,
			frequencyType: "per_week",
			frequencyTarget: 3,
		});
		expect(result).toBe(1);
	});

	it("returns 3 weeks with target of 1 per week", () => {
		const completions = [
			getWeekDate(0, 0),
			getWeekDate(1, 0),
			getWeekDate(2, 0),
		];
		const result = calculateCurrentStreak({
			completions,
			frequencyType: "per_week",
			frequencyTarget: 1,
		});
		expect(result).toBe(3);
	});

	it("handles exceeding target in a week", () => {
		const completions = [
			getWeekDate(0, 0),
			getWeekDate(0, 1),
			getWeekDate(0, 2),
			getWeekDate(0, 3),
			getWeekDate(0, 4),
		];
		const result = calculateCurrentStreak({
			completions,
			frequencyType: "per_week",
			frequencyTarget: 3,
		});
		expect(result).toBe(1);
	});

	it("stops streak when a week doesn't meet target", () => {
		const completions = [
			getWeekDate(0, 0),
			getWeekDate(0, 2),
			getWeekDate(0, 4),
			getWeekDate(1, 0),
			getWeekDate(1, 2),
			getWeekDate(1, 4),
			getWeekDate(2, 0),
			getWeekDate(3, 0),
			getWeekDate(3, 2),
			getWeekDate(3, 4),
		];
		const result = calculateCurrentStreak({
			completions,
			frequencyType: "per_week",
			frequencyTarget: 3,
		});
		expect(result).toBe(2);
	});
});

describe("calculateCurrentStreak - scheduled_days", () => {
	const getTodayString = () => format(new Date(), "yyyy-MM-dd");

	it("returns 0 for no completions", () => {
		const result = calculateCurrentStreak({
			completions: [],
			frequencyType: "scheduled_days",
			frequencyDays: ["mon", "wed", "fri"],
		});
		expect(result).toBe(0);
	});

	it("returns 1 when completed today and today is a scheduled day", () => {
		const today = new Date();
		const dayOfWeek = format(today, "EEE").toLowerCase();

		const result = calculateCurrentStreak({
			completions: [getTodayString()],
			frequencyType: "scheduled_days",
			frequencyDays: [dayOfWeek as Weekday],
		});
		expect(result).toBe(1);
	});

	it("returns 0 when completed today but today is not a scheduled day", () => {
		const today = new Date();
		const dayOfWeek = format(today, "EEE").toLowerCase();

		const otherDays = ["mon", "wed", "fri"].filter(
			(d) => d !== dayOfWeek,
		) as Weekday[];

		const result = calculateCurrentStreak({
			completions: [getTodayString()],
			frequencyType: "scheduled_days",
			frequencyDays: otherDays,
		});
		expect(result).toBe(0);
	});

	it("counts streak only on scheduled days (Mon/Wed/Fri)", () => {
		vi.setSystemTime(new Date("2025-12-19"));

		const completions = [
			"2025-12-19",
			"2025-12-18",
			"2025-12-17",
			"2025-12-15",
		];

		const result = calculateCurrentStreak({
			completions,
			frequencyType: "scheduled_days",
			frequencyDays: ["mon", "wed", "fri"],
		});
		expect(result).toBe(3);

		vi.useRealTimers();
	});

	it("returns 1 when most recent scheduled day is completed but previous was missed", () => {
		vi.setSystemTime(new Date("2025-12-19"));

		const completions = ["2025-12-15", "2025-12-19"];

		const result = calculateCurrentStreak({
			completions,
			frequencyType: "scheduled_days",
			frequencyDays: ["mon", "wed", "fri"],
		});
		expect(result).toBe(1);

		vi.useRealTimers();
	});

	it("returns 1 when a scheduled day is missed (only most recent counts)", () => {
		vi.setSystemTime(new Date("2025-12-19"));

		const completions = ["2025-12-19", "2025-12-15"];

		const result = calculateCurrentStreak({
			completions,
			frequencyType: "scheduled_days",
			frequencyDays: ["mon", "wed", "fri"],
		});
		expect(result).toBe(1);

		vi.useRealTimers();
	});

	it("handles streak across multiple weeks", () => {
		vi.setSystemTime(new Date("2025-12-19"));

		const completions = [
			"2025-12-19",
			"2025-12-17",
			"2025-12-15",
			"2025-12-12",
			"2025-12-10",
			"2025-12-08",
		];

		const result = calculateCurrentStreak({
			completions,
			frequencyType: "scheduled_days",
			frequencyDays: ["mon", "wed", "fri"],
		});
		expect(result).toBe(6);

		vi.useRealTimers();
	});

	it("returns streak count when all scheduled days completed within grace period", () => {
		vi.setSystemTime(new Date("2025-12-20"));

		const completions = ["2025-12-07", "2025-12-14"];

		const result = calculateCurrentStreak({
			completions,
			frequencyType: "scheduled_days",
			frequencyDays: ["sun"],
		});
		expect(result).toBe(2);

		vi.useRealTimers();
	});

	it("allows streak to start from yesterday if today is not scheduled", () => {
		vi.setSystemTime(new Date("2025-12-16"));

		const completions = ["2025-12-15"];

		const result = calculateCurrentStreak({
			completions,
			frequencyType: "scheduled_days",
			frequencyDays: ["mon", "wed", "fri"],
		});
		expect(result).toBe(1);

		vi.useRealTimers();
	});
});
