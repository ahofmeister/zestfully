import { parseISO } from "date-fns";
import { describe, expect, it } from "vitest";
import { calculateCelebrationDate } from "./milestone-celebration-calculator";

describe("calculateCelebrationDate", () => {
	describe("days", () => {
		it("should add days correctly", () => {
			const startDate = parseISO("2026-01-01");
			const result = calculateCelebrationDate(startDate, {
				value: 3,
				unit: "days",
			});

			expect(result).toEqual(parseISO("2026-01-04"));
		});

		it("should handle single day", () => {
			const startDate = parseISO("2026-01-01");
			const result = calculateCelebrationDate(startDate, {
				value: 1,
				unit: "days",
			});

			expect(result).toEqual(parseISO("2026-01-02"));
		});

		it("should handle days crossing month boundary", () => {
			const startDate = parseISO("2026-01-30");
			const result = calculateCelebrationDate(startDate, {
				value: 5,
				unit: "days",
			});

			expect(result).toEqual(parseISO("2026-02-04"));
		});
	});

	describe("weeks", () => {
		it("should add weeks correctly", () => {
			const startDate = parseISO("2026-01-01");
			const result = calculateCelebrationDate(startDate, {
				value: 1,
				unit: "weeks",
			});

			expect(result).toEqual(parseISO("2026-01-08"));
		});

		it("should handle multiple weeks", () => {
			const startDate = parseISO("2026-01-01");
			const result = calculateCelebrationDate(startDate, {
				value: 4,
				unit: "weeks",
			});

			expect(result).toEqual(parseISO("2026-01-29"));
		});

		it("should handle weeks crossing year boundary", () => {
			const startDate = parseISO("2025-12-25");
			const result = calculateCelebrationDate(startDate, {
				value: 2,
				unit: "weeks",
			});

			expect(result).toEqual(parseISO("2026-01-08"));
		});
	});

	describe("months", () => {
		it("should add months correctly", () => {
			const startDate = parseISO("2026-01-15");
			const result = calculateCelebrationDate(startDate, {
				value: 1,
				unit: "months",
			});

			expect(result).toEqual(parseISO("2026-02-15"));
		});

		it("should handle multiple months", () => {
			const startDate = parseISO("2026-01-01");
			const result = calculateCelebrationDate(startDate, {
				value: 6,
				unit: "months",
			});

			expect(result).toEqual(parseISO("2026-07-01"));
		});

		it("should handle months crossing year", () => {
			const startDate = parseISO("2025-11-15");
			const result = calculateCelebrationDate(startDate, {
				value: 3,
				unit: "months",
			});

			expect(result).toEqual(parseISO("2026-02-15"));
		});

		it("should handle month with fewer days (Jan 31 + 1 month)", () => {
			const startDate = parseISO("2026-01-31");
			const result = calculateCelebrationDate(startDate, {
				value: 1,
				unit: "months",
			});

			expect(result).toEqual(parseISO("2026-02-28"));
		});
	});

	describe("years", () => {
		it("should add years correctly", () => {
			const startDate = parseISO("2026-01-01");
			const result = calculateCelebrationDate(startDate, {
				value: 1,
				unit: "years",
			});

			expect(result).toEqual(parseISO("2027-01-01"));
		});

		it("should handle multiple years", () => {
			const startDate = parseISO("2026-01-01");
			const result = calculateCelebrationDate(startDate, {
				value: 5,
				unit: "years",
			});

			expect(result).toEqual(parseISO("2031-01-01"));
		});

		it("should handle leap year (Feb 29)", () => {
			const startDate = parseISO("2024-02-29");
			const result = calculateCelebrationDate(startDate, {
				value: 1,
				unit: "years",
			});

			expect(result).toEqual(parseISO("2025-02-28"));
		});
	});

	describe("date immutability", () => {
		it("should not mutate the input date", () => {
			const startDate = parseISO("2026-01-01");
			const originalTime = startDate.getTime();

			calculateCelebrationDate(startDate, { value: 10, unit: "days" });

			expect(startDate.getTime()).toBe(originalTime);
		});
	});
});
