"use client";
import { CheckIcon, MinusIcon, PlusIcon } from "lucide-react";
import { startTransition, useState } from "react";
import AddMealItemButton from "@/app/(app)/home/add-meal-item-button";
import { Dot } from "@/app/(app)/home/dot";
import { MacroValue } from "@/app/(app)/home/macro-value";
import { MealActionsButton } from "@/app/(app)/home/meal-actions-button";
import { calculateNutrients, macroColors, round } from "@/app/(app)/home/nutrition-calculation";
import { updateMealItemQuantity } from "@/components/meal-item/meal-item-actions";
import MealItemRowActions from "@/components/meal-item/meal-item-row-actions";
import { capitalizeFirstLetter } from "@/components/strings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { MealItemWithFood, MealType } from "@/drizzle/schema";

const MealCard = ({
	mealItems: initialItems,
	type,
	date,
}: {
	mealItems: MealItemWithFood[];
	type: MealType;
	date: Date;
}) => {
	const [pendingQuantities, setPendingQuantities] = useState<Record<string, number>>({});

	const mealItems = initialItems?.map((item) =>
		item.id in pendingQuantities ? { ...item, quantity: pendingQuantities[item.id] } : item,
	);
	const nutrients = calculateNutrients(mealItems ?? []);

	const updateItemQuantity = (id: string, quantity: number) => {
		setPendingQuantities((prev) => ({ ...prev, [id]: quantity }));
	};

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
						return (
							<MealItemRow
								onQuantityChange={updateItemQuantity}
								key={mealItem.id}
								mealItem={mealItem}
							/>
						);
					})}
				</ul>
			</CardContent>
		</Card>
	);
};

export default MealCard;

const MealItemRow = ({
	mealItem,
	onQuantityChange,
}: {
	mealItem: MealItemWithFood;
	onQuantityChange: (id: string, quantity: number) => void;
}) => {
	const [editingIngredientId, setEditingIngredientId] = useState<string | null>(null);
	const [draftQuantity, setDraftQuantity] = useState(mealItem.quantity);

	const isEditing = editingIngredientId === mealItem.id;
	const quantity = isEditing ? draftQuantity : mealItem.quantity;

	const startEdit = () => {
		setDraftQuantity(mealItem.quantity);
		setEditingIngredientId(mealItem.id);
	};

	const commitQuantity = (next: number) => {
		const safe = Math.max(0, next);
		setDraftQuantity(safe);
		onQuantityChange(mealItem.id, safe);
		startTransition(() => {
			void updateMealItemQuantity(mealItem.id, safe);
		});
	};

	const exitEdit = () => {
		commitQuantity(draftQuantity);
		setEditingIngredientId(null);
	};

	const nutrients = calculateNutrients({ ...mealItem, quantity });

	return (
		<li key={mealItem.id} className="px-4 py-2">
			<div className="flex items-center justify-between gap-3">
				<div className="space-y-1 min-w-0">
					<p className="truncate text-sm text-foreground">{mealItem.food.name}</p>

					<div className="font-mono text-xs tabular-nums text-muted-foreground">
						{isEditing && (
							<div className="flex gap-x-1 items-center">
								<Button size="xs" onClick={() => commitQuantity(quantity - 1)}>
									<MinusIcon size={5} />
								</Button>
								<Input
									value={quantity}
									onChange={(e) => {
										const val = Number(e.target.value);
										if (!Number.isNaN(val)) {
											setDraftQuantity(val);
											onQuantityChange(mealItem.id, val);
										}
									}}
									onBlur={exitEdit}
									className="h-7 w-10 rounded-[5px] px-1.5 text-center text-sm"
								/>
								{mealItem.unit}
								<Button size="xs" onClick={() => commitQuantity(quantity + 1)}>
									<PlusIcon size={5} />
								</Button>

								<Button size="xs" variant="outline" onClick={exitEdit}>
									<CheckIcon size={10} />
								</Button>
							</div>
						)}

						{!isEditing && (
							<button
								type="button"
								onClick={startEdit}
								className="text-left bg-transparent border-0 p-0 m-0 font-mono text-xs tabular-nums text-muted-foreground cursor-pointer"
							>
								{quantity}
								{mealItem.unit}
							</button>
						)}
					</div>
				</div>
				<div className="flex shrink-0 items-center gap-4 whitespace-nowrap font-mono text-xs tabular-nums">
					<span className="w-20 text-right text-foreground">
						{round(nutrients.energy)} <span className="text-muted-foreground">kcal</span>
					</span>
					<MacroValue colorVar={macroColors.protein} value={nutrients.protein} />
					<MacroValue colorVar={macroColors.carbohydrates} value={nutrients.carbohydrates} />
					<MacroValue colorVar={macroColors.fat} value={nutrients.fat} />
					<MealItemRowActions id={mealItem.id} />
				</div>
			</div>
		</li>
	);
};
