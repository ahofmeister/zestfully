import { addDays, format, startOfWeek, subDays } from "date-fns";
import { describe, expect, it } from "vitest";
import { calculateCurrentStreak } from "@/components/habit/streak-calculator";

describe("calculateCurrentStreak - daily", () => {
	const getTodayString = () => format(new Date(), "yyyy-MM-dd");
	const daysAgoString = (days: number) =>
		format(subDays(new Date(), days), "yyyy-MM-dd");

	it("returns 0 for no completions", () => {
		const result = calculateCurrentStreak([], "daily", 0);
		expect(result).toBe(0);
	});

	it("returns 1 for completion today only", () => {
		const result = calculateCurrentStreak([getTodayString()], "daily", 0);
		expect(result).toBe(1);
	});

	it("returns 1 for completion yesterday only", () => {
		const result = calculateCurrentStreak([daysAgoString(1)], "daily", 0);
		expect(result).toBe(1);
	});

	it("returns 0 for completion 2 days ago (streak broken)", () => {
		const result = calculateCurrentStreak([daysAgoString(2)], "daily", 0);
		expect(result).toBe(0);
	});

	it("returns 3 for consecutive 3 days including today", () => {
		const result = calculateCurrentStreak(
			[getTodayString(), daysAgoString(1), daysAgoString(2)],
			"daily",
			0,
		);
		expect(result).toBe(3);
	});

	it("returns 3 for consecutive 3 days including yesterday", () => {
		const result = calculateCurrentStreak(
			[daysAgoString(1), daysAgoString(2), daysAgoString(3)],
			"daily",
			0,
		);
		expect(result).toBe(3);
	});

	it("returns 2 for today and yesterday, ignoring older gap", () => {
		const result = calculateCurrentStreak(
			[getTodayString(), daysAgoString(1), daysAgoString(5), daysAgoString(6)],
			"daily",
			0,
		);
		expect(result).toBe(2);
	});

	it("handles unordered completions", () => {
		const result = calculateCurrentStreak(
			[daysAgoString(2), getTodayString(), daysAgoString(1)],
			"daily",
			0,
		);
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
		const result = calculateCurrentStreak([], "per_week", 3);
		expect(result).toBe(0);
	});

	it("returns 0 when target not met in current or previous week", () => {
		const result = calculateCurrentStreak(
			[getTodayString(), daysAgoString(2)],
			"per_week",
			3,
		);
		expect(result).toBe(0);
	});

	it("returns 1 week when target met in current week only", () => {
		const completions = [
			getWeekDate(0, 0),
			getWeekDate(0, 2),
			getWeekDate(0, 4),
		];
		const result = calculateCurrentStreak(completions, "per_week", 3);
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
		const result = calculateCurrentStreak(completions, "per_week", 3);
		expect(result).toBe(2);
	});

	it("returns 1 when target met last week but not current week", () => {
		const completions = [
			getTodayString(),
			getWeekDate(1, 0),
			getWeekDate(1, 2),
			getWeekDate(1, 4),
		];
		const result = calculateCurrentStreak(completions, "per_week", 3);
		expect(result).toBe(1);
	});

	it("returns 3 weeks with target of 1 per week", () => {
		const completions = [
			getWeekDate(0, 0),
			getWeekDate(1, 0),
			getWeekDate(2, 0),
		];
		const result = calculateCurrentStreak(completions, "per_week", 1);
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
		const result = calculateCurrentStreak(completions, "per_week", 3);
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
		const result = calculateCurrentStreak(completions, "per_week", 3);
		expect(result).toBe(2);
	});
});

describe("calculateCurrentStreak - specific_days", () => {
	const getTodayString = () => format(new Date(), "yyyy-MM-dd");

	it("returns 0 (not yet implemented)", () => {
		const result = calculateCurrentStreak(
			[getTodayString()],
			"specific_days",
			0,
		);
		expect(result).toBe(0);
	});
});
