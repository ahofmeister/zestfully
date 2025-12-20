import {
	getDay,
	getISOWeek,
	getYear,
	parseISO,
	startOfDay,
	startOfWeek,
	subDays,
	subWeeks,
} from "date-fns";
import { type FrequencyType, WEEKDAYS, type Weekday } from "@/drizzle/schema";

export type StreakOptions = {
	completions: string[];
	frequencyType: FrequencyType;
	frequencyTarget?: number;
	frequencyDays?: Weekday[];
};

function parseDate(dateStr: string): number {
	return startOfDay(parseISO(dateStr)).getTime();
}

export function calculateCurrentStreak(options: StreakOptions): number {
	const {
		completions,
		frequencyType,
		frequencyTarget = 0,
		frequencyDays,
	} = options;

	if (completions.length === 0) {
		return 0;
	}

	switch (frequencyType) {
		case "daily":
			return calculateDailyStreak(completions);
		case "per_week":
			return calculateWeeklyStreak(completions, frequencyTarget);
		case "scheduled_days":
			return calculateScheduledDaysStreak(completions, frequencyDays ?? null);
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

function calculateScheduledDaysStreak(
	completions: string[],
	days: Weekday[] | null,
) {
	if (!days || days.length === 0) {
		return 0;
	}

	const completionDates = new Set(completions.map(parseDate));
	const today = startOfDay(new Date());

	let checkDate = findStartingPoint(today, completionDates, days);

	if (!checkDate) {
		return 0;
	}

	let streak = 0;

	while (true) {
		if (isScheduledDay(checkDate, days)) {
			if (completionDates.has(checkDate.getTime())) {
				streak++;
				checkDate = startOfDay(subDays(checkDate, 1));
			} else {
				break;
			}
		} else {
			checkDate = startOfDay(subDays(checkDate, 1));
		}
	}

	return streak;
}

const isScheduledDay = (date: Date, days: Weekday[]): boolean => {
	const dayIndex = getDay(date);
	const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
	const weekday = WEEKDAYS[adjustedIndex];
	return days.includes(weekday);
};

function findStartingPoint(
	today: Date,
	completionDates: Set<number>,
	days: Weekday[],
): Date | null {
	let checkDate = today;

	for (let i = 0; i < 7; i++) {
		if (isScheduledDay(checkDate, days)) {
			if (completionDates.has(checkDate.getTime())) {
				return checkDate;
			}
			checkDate = startOfDay(subDays(checkDate, 1));

			for (let j = 0; j < 7; j++) {
				if (isScheduledDay(checkDate, days)) {
					if (completionDates.has(checkDate.getTime())) {
						return checkDate;
					}
					return null;
				}
				checkDate = startOfDay(subDays(checkDate, 1));
			}
			return null;
		}
		checkDate = startOfDay(subDays(checkDate, 1));
	}

	return null;
}
