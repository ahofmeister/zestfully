import { addDays, addMonths, addWeeks, addYears } from "date-fns";

export type Celebration = {
	value: number;
	unit: "days" | "weeks" | "months" | "years";
};

export const formatCelebration = (celebration: {
	value: number;
	unit: string;
}): string => {
	const { value, unit } = celebration;
	if (value === 1) {
		return `1 ${unit.slice(0, -1)}`;
	}
	return `${value} ${unit}`;
};

export const calculateCelebrationDate = (
	startDate: Date,
	celebration: { value: number; unit: "days" | "weeks" | "months" | "years" },
): Date => {
	switch (celebration.unit) {
		case "days":
			return addDays(startDate, celebration.value);
		case "weeks":
			return addWeeks(startDate, celebration.value);
		case "months":
			return addMonths(startDate, celebration.value);
		case "years":
			return addYears(startDate, celebration.value);
	}
};

export const celebrationToDays = (celebration: Celebration): number => {
	const multipliers = { days: 1, weeks: 7, months: 30, years: 365 };
	return celebration.value * (multipliers[celebration.unit] || 1);
};

export const sortCelebrations = (
	celebrations: Celebration[],
): Celebration[] => {
	return [...celebrations].sort(
		(a, b) => celebrationToDays(a) - celebrationToDays(b),
	);
};
