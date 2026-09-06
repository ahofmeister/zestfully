import AddMealItemButton from "@/app/(app)/home/add-meal-item-button";
import { Dot } from "@/app/(app)/home/dot";
import { MacroValue } from "@/app/(app)/home/macro-value";
import { MealActionsButton } from "@/app/(app)/home/meal-actions-button";
import { calculateNutrients, macroColors, round } from "@/app/(app)/home/nutrition-calculation";
import { MealItemQuantityControl } from "@/components/meal-item/meal-item-quantity-control";
import MealItemRowActions from "@/components/meal-item/meal-item-row-actions";
import { capitalizeFirstLetter } from "@/components/strings";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { MealItemWithFood, MealType } from "@/drizzle/schema";

const MealCard = ({
	mealItems,
	type,
	date,
}: {
	mealItems: MealItemWithFood[];
	type: MealType;
	date: Date;
}) => {
	const nutrients = calculateNutrients(mealItems ?? []);

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between">
					<div className="flex gap-x-2 items-center">
						<h2>{capitalizeFirstLetter(type)}</h2>
						<p className="text-gray-500">{round(nutrients.energy, 0, 0)} kcal</p>
					</div>
					<div className={"flex items-center gap-x-2"}>
						<AddMealItemButton type={type} date={date} />
						<MealActionsButton items={mealItems} />
					</div>
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
					{mealItems?.map((mealItem) => {
						return <MealItemRow key={mealItem.id} mealItem={mealItem} />;
					})}
				</ul>
			</CardContent>
		</Card>
	);
};

export default MealCard;

const MealItemRow = ({ mealItem }: { mealItem: MealItemWithFood }) => {
	const nutrients = calculateNutrients(mealItem);
	return (
		<li key={mealItem.id} className="px-4 py-2">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 items-center gap-3">
						<div className="min-w-0">
							<p className="truncate text-sm text-foreground">{mealItem.food.name}</p>
							<p className="font-mono text-xs tabular-nums text-muted-foreground">
								{mealItem.unit ?? "serving"}
							</p>
						</div>
						<MealItemQuantityControl id={mealItem.id} quantity={mealItem.quantity} unit={mealItem.unit} />
					</div>
					<div className="flex items-center justify-between gap-3 whitespace-nowrap font-mono text-xs tabular-nums sm:justify-end">
						<span className="text-right text-foreground">
							{round(nutrients.energy)} <span className="text-muted-foreground">kcal</span>
						</span>
						<div className="hidden items-center gap-4 md:flex">
							<MacroValue colorVar={macroColors.protein} value={nutrients.protein} />
							<MacroValue colorVar={macroColors.carbohydrates} value={nutrients.carbohydrates} />
							<MacroValue colorVar={macroColors.fat} value={nutrients.fat} />
						</div>
						<MealItemRowActions id={mealItem.id} />
					</div>
				</div>

		</li>
	);
};
