import { eq } from "drizzle-orm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SearchParams } from "nuqs/server";
import { MacroLegend } from "@/app/(app)/home/macro-legend";
import { MacroValue } from "@/app/(app)/home/macro-value";
import MealCard from "@/app/(app)/home/meal-card";
import { calculateNutrients, macroColors, round } from "@/app/(app)/home/nutrition-calculation";
import { DateLabel } from "@/components/date-label";
import { DateStepper } from "@/components/date-stepper";
import { loadSearchParams } from "@/components/home/date-parser";
import { Card, CardContent } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { type MealItemWithFood, mealItemSchema, mealTypes } from "@/drizzle/schema";

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
	const { date } = await loadSearchParams(searchParams);

	const items = await dbTransaction((tx) => {
		return tx.query.mealItemSchema.findMany({
			with: { food: true },
			where: eq(mealItemSchema.date, date.toDateString()),
		});
	});

	const totalNutrients = calculateNutrients(items);

	const categories = items.reduce(
		(groups, mealItem) => {
			const type = mealItem.mealType;

			if (!groups[type]) {
				groups[type] = [];
			}

			groups[type].push(mealItem);
			return groups;
		},
		{} as Record<string, MealItemWithFood[]>,
	);

	return (
		<div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
			<div className="flex font-semibold text-2xl items-center gap-x-4 justify-between">
				<DateStepper amount={-1} icon={<ChevronLeft />} />
				<DateLabel />
				<DateStepper amount={1} icon={<ChevronRight />} />
			</div>

			<Card className="mt-4">
				<CardContent className="p-4">
					<p className="text-xs uppercase tracking-wider text-muted-foreground">Calories</p>
					<p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
						{round(totalNutrients.energy)}
					</p>
					<div className="flex gap-x-10 mt-4">
						<MacroValue colorVar={macroColors.protein} value={totalNutrients.protein} />
						<MacroValue colorVar={macroColors.carbohydrates} value={totalNutrients.carbohydrates} />
						<MacroValue colorVar={macroColors.fat} value={totalNutrients.fat} />
					</div>
				</CardContent>
			</Card>

			<MacroLegend />

			<div className="flex flex-col gap-y-4 mt-2">
				{mealTypes.map((type) => {
					const items = categories[type];
					return <MealCard key={type} mealItems={items} type={type} date={date} />;
				})}
			</div>
		</div>
	);
}
