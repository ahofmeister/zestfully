"use client";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import { addMeal } from "@/app/planner/planner-actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function AddMeal(props: { date: Date }) {
	const [currentMealType, setCurrentMealType] = useState<string>("");

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		const meal = formData?.get("meal") as string;

		if (meal.length === 0) {
			return;
		}

		void addMeal({
			date: format(props.date, "yyyy-MM-dd"),
			meal: meal,
			meal_type: currentMealType,
		});
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"default"} size={"iconSm"}>
					<PlusIcon size={"15"} />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Add meal to {format(props.date, "EEEE")}</DialogTitle>
					</DialogHeader>

					<Input
						className={"mt-4"}
						name={"meal"}
						placeholder={"Enter your meal"}
					/>

					<ToggleGroup
						className={"flex justify-start my-2"}
						size={"sm"}
						type="single"
						onValueChange={(value) => setCurrentMealType(value)}
					>
						<ToggleGroupItem value="breakfast" aria-label="Toggle bold">
							Breakfast
						</ToggleGroupItem>
						<ToggleGroupItem value="lunch" aria-label="Toggle italic">
							Lunch
						</ToggleGroupItem>
						<ToggleGroupItem value="dinner" aria-label="Toggle underline">
							Dinner
						</ToggleGroupItem>
						<ToggleGroupItem value="snack" aria-label="Toggle underline">
							Snack
						</ToggleGroupItem>
					</ToggleGroup>
					<DialogFooter>
						<Button type="submit">Create</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
