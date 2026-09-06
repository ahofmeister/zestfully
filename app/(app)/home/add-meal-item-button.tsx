"use client";

import { PlusIcon } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { searchFood } from "@/app/(app)/foods/food-actions";
import { addMealItem } from "@/components/meal-item/meal-item-actions";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { MealType } from "@/drizzle/schema";

type ActionState = { error: string | null; success: boolean };

const AddMealItemButton = ({ type, date }: { type: MealType; date: Date }) => {
	const formRef = useRef<HTMLFormElement>(null);
	const [autocompleteKey, setAutocompleteKey] = useState(0);

	const [_, formAction, isPending] = useActionState(
		async (_: ActionState, formData: FormData): Promise<ActionState> => {
			const foodId = formData.get("foodId") as string;
			const quantity = Number(formData.get("quantity") as string);

			if (!foodId) {
				return { error: "Please select a foodId", success: false };
			}

			await addMealItem(date, type, foodId, quantity);

			formRef.current?.reset();
			setAutocompleteKey((k) => k + 1);

			return { error: null, success: true };
		},
		{ success: true, error: null },
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

				<form ref={formRef} action={formAction} className="flex flex-col gap-y-4">
					<Autocomplete
						key={autocompleteKey}
						name="foodId"
						fetchOptions={async (query: string) => {
							return searchFood(query).then((food) =>
								food.map((food) => ({
									value: food.id,
									label: food.name,
								})),
							);
						}}
					/>

					<Input placeholder="Quantity in gram" name="quantity" required />

					<div className="flex justify-end gap-3 mt-4">
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
