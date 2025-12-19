import {
	getISOWeek,
	getYear,
	parseISO,
	startOfDay,
	startOfWeek,
	subDays,
	subWeeks,
} from "date-fns";

export type FrequencyType = "daily" | "per_week" | "specific_days";

function parseDate(dateStr: string): number {
	return startOfDay(parseISO(dateStr)).getTime();
}

export function calculateCurrentStreak(
	completions: string[],
	frequencyType: FrequencyType,
	frequencyTarget: number,
): number {
	if (completions.length === 0) {
		return 0;
	}

	switch (frequencyType) {
		case "daily":
			return calculateDailyStreak(completions);
		case "per_week":
			return calculateWeeklyStreak(completions, frequencyTarget);
		case "specific_days":
			return 0;
	}
}

function calculateDailyStreak(completions: string[]): number {
	const completionDates = new Set(completions.map(parseDate));

	const today = startOfDay(new Date());
	const yesterday = startOfDay(subDays(new Date(), 1));

	const hasToday = completionDates.has(today.getTime());
	const hasYesterday = completionDates.has(yesterday.getTime());

	if (!hasToday && !hasYesterday) {
		return 0;
	}

	let streak = 0;
	let checkDate = hasToday ? today : yesterday;

	while (completionDates.has(checkDate.getTime())) {
		streak++;
		checkDate = startOfDay(subDays(checkDate, 1));
	}

	return streak;
}

export function calculateWeeklyStreak(
	completions: string[],
	frequencyTarget: number,
): number {
	const weekCounts = new Map<string, number>();

	completions.forEach((dateStr) => {
		const date = parseISO(dateStr);
		const weekStart = startOfWeek(date, { weekStartsOn: 1 });
		const key = `${getYear(weekStart)}-${getISOWeek(weekStart)}`;
		weekCounts.set(key, (weekCounts.get(key) || 0) + 1);
	});

	let streak = 0;
	let currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
	const currentWeekKey = `${getYear(currentWeekStart)}-${getISOWeek(currentWeekStart)}`;

	if ((weekCounts.get(currentWeekKey) || 0) < frequencyTarget) {
		currentWeekStart = subWeeks(currentWeekStart, 1);
	}

	while (
		(weekCounts.get(
			`${getYear(currentWeekStart)}-${getISOWeek(currentWeekStart)}`,
		) || 0) >= frequencyTarget
	) {
		streak++;
		currentWeekStart = subWeeks(currentWeekStart, 1);
	}

	return streak;
}
