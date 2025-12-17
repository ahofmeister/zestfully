export function formatDate(date: Date): string {
	return date.toISOString().split("T")[0];
}

export function isDateToday(date: Date): boolean {
	const today = new Date();
	return formatDate(date) === formatDate(today);
}

export function generateYearWeeks(): (Date | null)[][] {
	const weeks: (Date | null)[][] = [];
	const today = new Date();
	const currentYear = today.getFullYear();

	const startDate = new Date(currentYear, 0, 1);

	const firstDay = new Date(startDate);
	const dayOfWeek = firstDay.getDay();
	const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
	firstDay.setDate(firstDay.getDate() + daysToMonday);

	const currentDate = new Date(firstDay);
	const endDate = new Date(currentYear, 11, 31);

	while (currentDate <= endDate) {
		const weekDates: (Date | null)[] = [];

		for (let day = 0; day < 7; day++) {
			const date = new Date(currentDate);
			date.setDate(currentDate.getDate() + day);

			const dateYear = date.getFullYear();
			const dateMonth = date.getMonth();
			const dateDay = date.getDate();

			const normalizedDate = new Date(
				`${dateYear}-${String(dateMonth + 1).padStart(2, "0")}-${String(dateDay).padStart(2, "0")}`,
			);

			if (normalizedDate.getFullYear() === currentYear) {
				weekDates.push(normalizedDate);
			} else {
				weekDates.push(null);
			}
		}

		weeks.push(weekDates);
		currentDate.setDate(currentDate.getDate() + 7);
	}

	return weeks;
}

export function getMonthLabels(weeks: (Date | null)[][]): string[] {
	const labels: string[] = [];
	let lastMonth = -1;

	weeks.forEach((week) => {
		const firstDayInYear = week.find(
			(d) => d !== null && d.getFullYear() === new Date().getFullYear(),
		);

		if (!firstDayInYear) {
			labels.push("");
			return;
		}

		const month = firstDayInYear.getMonth();

		if (month !== lastMonth) {
			labels.push(
				firstDayInYear.toLocaleDateString("en-US", { month: "short" }),
			);
			lastMonth = month;
		} else {
			labels.push("");
		}
	});

	return labels;
}
