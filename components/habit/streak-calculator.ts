import { parseISO, startOfDay, subDays } from "date-fns";

export type FrequencyType = "daily" | "per_week" | "specific_days";

function parseDate(dateStr: string): number {
	return startOfDay(parseISO(dateStr)).getTime();
}

export function calculateCurrentStreak(
	completions: string[],
	frequencyType: FrequencyType,
): number {
	if (completions.length === 0) {
		return 0;
	}

	switch (frequencyType) {
		case "daily":
			return calculateDailyStreak(completions);
		case "per_week":
			throw new Error("per_week frequency not yet implemented");
		case "specific_days":
			throw new Error("specific_days frequency not yet implemented");
		default:
			throw new Error(`Unknown frequency type: ${frequencyType}`);
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
