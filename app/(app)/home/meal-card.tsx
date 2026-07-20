import { MacroValue } from "@/app/(app)/home/macro-value";
import { calculateNutrients, macroColors, round } from "@/app/(app)/home/nutrition-calculation";
import type { MealItemWithFood } from "@/drizzle/schema";

const MealCard = ({ mealItem }: { mealItem: MealItemWithFood }) => {
	const nutrients = calculateNutrients(mealItem);
	return (
		<li key={mealItem.id} className="px-4 py-2">
			<div className="flex items-center justify-between gap-3">
				<div className="min-w-0">
					<p className="truncate text-sm text-foreground">{mealItem.food.name}</p>
					<p className="font-mono text-xs tabular-nums text-muted-foreground">
						{mealItem.quantity}
						{mealItem.unit}
					</p>
				</div>
				<div className="flex shrink-0 items-center gap-4 whitespace-nowrap font-mono text-xs tabular-nums">
					<span className="w-20 text-right text-foreground">
						{round(nutrients.energy)} <span className="text-muted-foreground">kcal</span>
					</span>
					<MacroValue colorVar={macroColors.protein} value={nutrients.protein} />
					<MacroValue colorVar={macroColors.carbohydrates} value={nutrients.carbohydrates} />
					<MacroValue colorVar={macroColors.fat} value={nutrients.fat} />
				</div>
			</div>
		</li>
	);
};

export default MealCard;
