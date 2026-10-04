"use client";

import { type KeyboardEvent, useState } from "react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import type { foodSchema } from "@/drizzle/schema";

type Food = typeof foodSchema.$inferSelect;

type FoodComboboxProps = {
	foods: Food[];
	search: string;
	onChangeAction: (search: string) => void;
	onSelectAction: (food: Food) => void;
};

export const FoodCombobox = ({
	foods,
	search,
	onChangeAction,
	onSelectAction,
}: FoodComboboxProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleChange = (nextSearch: string) => {
		setIsOpen(nextSearch.length > 0);
		onChangeAction(nextSearch);
	};

	const handleSelect = (food: Food) => {
		setIsOpen(false);
		onSelectAction(food);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== "Enter" || isOpen) {
			return;
		}

		event.stopPropagation();
	};

	return (
		<Command className="relative overflow-visible rounded-md border">
			<CommandInput
				autoFocus
				placeholder="Type a food..."
				value={search}
				onValueChange={handleChange}
				onKeyDown={handleKeyDown}
				onBlur={() => setIsOpen(false)}
			/>

			{isOpen && (
				<CommandList
					className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-popover shadow-md"
					onMouseDown={(event) => event.preventDefault()}
				>
					<CommandEmpty>No food found.</CommandEmpty>
					<CommandGroup>
						{foods.map((food) => (
							<CommandItem
								key={food.id}
								value={`${food.name} ${food.id}`}
								keywords={[food.name]}
								onSelect={() => handleSelect(food)}
							>
								<span className="flex-1">{food.name}</span>
								<span className="text-xs text-muted-foreground">{food.energy} kcal / 100g</span>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			)}
		</Command>
	);
};
