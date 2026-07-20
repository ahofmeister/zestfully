import { eq } from "drizzle-orm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SearchParams } from "nuqs/server";
import AddMealItemButton from "@/app/(app)/home/add-meal-item-button";
import { Dot } from "@/app/(app)/home/dot";
import { MacroLegend } from "@/app/(app)/home/macro-legend";
import { MacroValue } from "@/app/(app)/home/macro-value";
import MealCard from "@/app/(app)/home/meal-card";
import { calculateNutrients, macroColors, round } from "@/app/(app)/home/nutrition-calculation";
import { DateLabel } from "@/components/date-label";
import { DateStepper } from "@/components/date-stepper";
import { loadSearchParams } from "@/components/home/date-parser";
import { capitalizeFirstLetter } from "@/components/strings";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { type foodSchema, mealItemSchema, mealTypes } from "@/drizzle/schema";

type MealItemWithFood = typeof mealItemSchema.$inferSelect & {
	food: typeof foodSchema.$inferInsert;
};

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

					const nutrients = calculateNutrients(items ?? []);

					return (
						<Card key={type}>
							<CardHeader>
								<div className="flex justify-between">
									<div className="flex gap-x-2 items-center">
										<h2>{capitalizeFirstLetter(type)}</h2>
										<p className="text-gray-500">{round(nutrients.energy, 0, 0)} kcal</p>
									</div>
									<AddMealItemButton type={type} date={date} />
								</div>
							</CardHeader>

							<CardContent className="p-0">
								<div className="flex items-center gap-5 border-t border-border bg-muted/30 px-4 py-2 font-mono text-xs tabular-nums text-foreground">
									<span className="flex items-center gap-1.5">
										<Dot colorVar={macroColors.protein} />
										{round(nutrients.protein, 1)}g
									</span>
									<span className="flex items-center gap-1.5">
										<Dot colorVar={macroColors.carbohydrates} />
										{round(nutrients.carbohydrates, 1)}g
									</span>
									<span className="flex items-center gap-1.5">
										<Dot colorVar={macroColors.fat} />
										{round(nutrients.fat, 1)}g
									</span>
								</div>
								<ul className="flex flex-col gap-y-4">
									{items?.map((mealItem) => {
										return <MealCard key={mealItem.id} mealItem={mealItem} />;
									})}
								</ul>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
