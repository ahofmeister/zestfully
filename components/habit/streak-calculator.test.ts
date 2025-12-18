import { format, subDays } from "date-fns";
import { describe, expect, it } from "vitest";
import { calculateCurrentStreak } from "./streak-calculator";

describe("calculateCurrentStreak", () => {
	const getTodayString = () => format(new Date(), "yyyy-MM-dd");
	const daysAgoString = (days: number) =>
		format(subDays(new Date(), days), "yyyy-MM-dd");

	it("returns 0 for no completions", () => {
		const result = calculateCurrentStreak([], "daily");
		expect(result).toBe(0);
	});

	it("returns 1 for completion today only", () => {
		const result = calculateCurrentStreak([getTodayString()], "daily");
		expect(result).toBe(1);
	});

	it("returns 1 for completion yesterday only", () => {
		const result = calculateCurrentStreak([daysAgoString(1)], "daily");
		expect(result).toBe(1);
	});

	it("returns 0 for completion 2 days ago (streak broken)", () => {
		const result = calculateCurrentStreak([daysAgoString(2)], "daily");
		expect(result).toBe(0);
	});

	it("returns 3 for consecutive 3 days including today", () => {
		const result = calculateCurrentStreak(
			[getTodayString(), daysAgoString(1), daysAgoString(2)],
			"daily",
		);
		expect(result).toBe(3);
	});

	it("returns 3 for consecutive 3 days including yesterday", () => {
		const result = calculateCurrentStreak(
			[daysAgoString(1), daysAgoString(2), daysAgoString(3)],
			"daily",
		);
		expect(result).toBe(3);
	});

	it("returns 2 for today and yesterday, ignoring older gap", () => {
		const result = calculateCurrentStreak(
			[getTodayString(), daysAgoString(1), daysAgoString(5), daysAgoString(6)],
			"daily",
		);
		expect(result).toBe(2);
	});

	it("handles duplicate dates", () => {
		const result = calculateCurrentStreak(
			[getTodayString(), getTodayString(), daysAgoString(1)],
			"daily",
		);
		expect(result).toBe(2);
	});

	it("handles unordered completions", () => {
		const result = calculateCurrentStreak(
			[daysAgoString(2), getTodayString(), daysAgoString(1)],
			"daily",
		);
		expect(result).toBe(3);
	});
});
