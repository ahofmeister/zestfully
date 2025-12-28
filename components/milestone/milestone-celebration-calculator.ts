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
	const date = new Date(startDate);

	switch (celebration.unit) {
		case "days":
			date.setDate(date.getDate() + celebration.value);
			break;
		case "weeks":
			date.setDate(date.getDate() + celebration.value * 7);
			break;
		case "months":
			date.setMonth(date.getMonth() + celebration.value);
			break;
		case "years":
			date.setFullYear(date.getFullYear() + celebration.value);
			break;
	}

	return date;
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
