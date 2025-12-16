import { TrashIcon } from "lucide-react";
import {
	calculateEnergy,
	calculateProtein,
} from "@/app/dashboard/nutrition-calculation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { food, mealItems } from "@/drizzle/schema";

type MealItem = typeof mealItems.$inferSelect & {
	food: typeof food.$inferSelect;
};

export function MealSection({
	title,
	items,
}: {
	title: string;
	items: (typeof mealItems.$inferSelect & {
		food: typeof food.$inferSelect;
	})[];
}) {
	const calculateCalories = (item: MealItem) =>
		calculateEnergy(item.quantity, item.food?.energy);

	const calculateItemProtein = (item: MealItem) =>
		calculateProtein(item.quantity, item.food?.protein);

	const calculateTotal = (calculator: (item: MealItem) => number) => {
		return items.reduce((sum, item) => sum + calculator(item), 0);
	};

	const calculateTotalCalories = () => calculateTotal(calculateCalories);
	const calculateTotalProtein = () => calculateTotal(calculateItemProtein);

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle>{title}</CardTitle>
					<div className="text-sm text-muted-foreground">
						<span>{calculateTotalCalories()} cal</span>
						<span className="mx-2">•</span>
						<span>{calculateTotalProtein()}g protein</span>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{items.length === 0 ? (
					<p className="text-sm text-muted-foreground">No items logged</p>
				) : (
					<div className="space-y-2">
						{items.map((item) => (
							<div
								key={item.id}
								className="flex justify-between items-center p-3 bg-muted rounded-md"
							>
								<div>
									<div className="font-medium">{item.food?.name}</div>
									<div className="text-sm text-muted-foreground">
										{item.quantity}g • {calculateCalories(item)} cal •{" "}
										{calculateItemProtein(item)}g protein
									</div>
								</div>
								<Button size="iconSm" variant={"ghost"}>
									<TrashIcon size={12} />
								</Button>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
