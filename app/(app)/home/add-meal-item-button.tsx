"use client";

import { PlusIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { addMealItem } from "@/components/meal-item/meal-item-actions";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FoodCombobox } from "@/components/ui/food-combobox";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { foodSchema, MealType } from "@/drizzle/schema";

type Food = typeof foodSchema.$inferSelect;

type ActionState = { error: string | null };

type AddMealItemButtonProps = {
	type: MealType;
	date: Date;
	foods: Food[];
};

const AddMealItemButton = ({ type, date, foods }: AddMealItemButtonProps) => {
	const [search, setSearch] = useState("");
	const [selectedFood, setSelectedFood] = useState<Food | null>(null);
	const [quantity, setQuantity] = useState("");

	const handleSearchChange = (nextSearch: string) => {
		setSearch(nextSearch);

		if (selectedFood) {
			setSelectedFood(null);
		}
	};

	const handleFoodSelect = (food: Food) => {
		setSelectedFood(food);
		setSearch(food.name);
		setQuantity(String(food.defaultQuantity));
	};

	const resetForm = () => {
		setSearch("");
		setSelectedFood(null);
		setQuantity("");
	};

	const [state, formAction, isPending] = useActionState(
		async (_: ActionState): Promise<ActionState> => {
			const parsedQuantity = Number(quantity);

			if (!selectedFood) {
				return { error: "Please select a food" };
			}

			if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
				return { error: "Please enter a valid quantity" };
			}

			await addMealItem(date, type, selectedFood.id, parsedQuantity);

			resetForm();

			return { error: null };
		},
		{ error: null },
	);

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size="iconSm">
					<PlusIcon className="size-4" />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Add to {type} for {date.toDateString()}
					</AlertDialogTitle>
				</AlertDialogHeader>

				<form action={formAction} className="flex flex-col gap-y-4">
					<FoodCombobox
						foods={foods}
						search={search}
						onChangeAction={handleSearchChange}
						onSelectAction={handleFoodSelect}
					/>

					<Input
						type="number"
						min={1}
						placeholder="Quantity in gram"
						value={quantity}
						onChange={(event) => setQuantity(event.target.value)}
						required
					/>

					{state.error && <p className="text-sm text-destructive">{state.error}</p>}

					<div className="mt-4 flex justify-end gap-3">
						<Button type="submit" disabled={isPending}>
							{isPending ? <Spinner /> : "Add"}
						</Button>
					</div>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default AddMealItemButton;
