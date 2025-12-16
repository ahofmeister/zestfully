"use client";

import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { addMealItem } from "@/app/dashboard/meal-actions";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { food, MealType } from "@/drizzle/schema";
import { cn } from "@/lib/utils";

type ActionState = {
	success: boolean;
	error?: string;
} | null;

export function AddItemStuff(props: {
	foods: (typeof food.$inferSelect)[];
	date: Date;
	userId: string;
	mealType: MealType;
}) {
	const [selectedFood, setSelectedFood] = useState(props.foods[0]);
	const [open, setOpen] = useState(false);
	const [comboboxOpen, setComboboxOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [message, formAction, isPending] = useActionState<
		ActionState,
		FormData
	>(addMealItem, null);

	const filteredFoods = useMemo(() => {
		if (!searchQuery) return props.foods;
		return props.foods.filter((f) =>
			f.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [props.foods, searchQuery]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm">
					<Plus className="h-4 w-4 mr-2" />
					Add Food
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add {props.mealType}</DialogTitle>
					<DialogDescription>
						{new Date(props.date).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</DialogDescription>
				</DialogHeader>
				<form action={formAction} className="space-y-3">
					<input type="hidden" name="userId" value={props.userId} />
					<input type="hidden" name="date" value={props.date.toISOString()} />
					<input type="hidden" name="foodId" value={selectedFood.id} />

					<div className="flex gap-x-2">
						<div className={"space-y-1.5"}>
							<Label className="text-sm">Food</Label>
							<Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={comboboxOpen}
										className="w-full justify-between h-10"
									>
										{selectedFood.name}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0" align="start">
									<Command>
										<CommandInput
											placeholder="Search food..."
											value={searchQuery}
											onValueChange={setSearchQuery}
										/>
										<CommandList>
											<CommandEmpty>No food found.</CommandEmpty>
											<CommandGroup>
												{filteredFoods.map((f) => (
													<CommandItem
														key={f.id}
														value={f.name}
														onSelect={() => {
															setSelectedFood(f);
															setComboboxOpen(false);
															setSearchQuery("");
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																selectedFood.id === f.id
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
														{f.name}
														<span className="ml-auto text-xs text-muted-foreground">
															{f.energy} cal
														</span>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="quantity" className="text-sm">
								Grams
							</Label>
							<Input
								type="number"
								id="quantity"
								name="quantity"
								step="0.1"
								min="0.1"
								required
								placeholder="100"
								className="h-10"
							/>
						</div>
					</div>

					<div className="flex grid-cols-2 gap-3">
						<input type="hidden" name="mealType" value={props.mealType} />
					</div>

					<div className="pt-2 pb-1 px-3 bg-muted/50 rounded-md text-xs text-muted-foreground">
						<div className="flex justify-between">
							<span>{selectedFood.energy} cal</span>
							{selectedFood.protein && (
								<span>{selectedFood.protein}g protein</span>
							)}
						</div>
						<div className="text-[10px] mt-0.5">per 100g</div>
					</div>

					<Button type="submit" disabled={isPending} className="w-full h-10">
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isPending ? "Adding..." : "Add Meal"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
