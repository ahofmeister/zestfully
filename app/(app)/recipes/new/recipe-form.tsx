"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { searchFood } from "@/app/(app)/foods/food-actions";
import { saveRecipe } from "@/app/(app)/recipes/recipe-actions";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { RecipeWithIngredients } from "@/drizzle/schema";

const recipeFormSchema = z.object({
	name: z.string().min(3),
	instructions: z.string().optional(),
	portions: z.coerce.number().optional(),
	ingredients: z.array(
		z.object({
			foodId: z.string().min(1, "Pick a food"),
			foodName: z.string().optional(),
			quantity: z.coerce.number().min(0),
			unit: z.string().min(1),
		}),
	),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

export function RecipeForm({ recipe }: { recipe: RecipeWithIngredients }) {
	const form = useForm<RecipeFormValues>({
		resolver: zodResolver(recipeFormSchema),
		defaultValues: {
			name: recipe?.name ?? "",
			instructions: recipe?.instructions ?? "",
			portions: recipe?.servings ?? 1,
			ingredients: recipe?.ingredients?.map((ingredient) => ({
				foodId: ingredient.foodId,
				foodName: ingredient.food.name,
				quantity: ingredient.quantity,
				unit: ingredient.unit,
			})),
		},
		mode: "onBlur",
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "ingredients",
	});

	function handleAddIngredient() {
		append({
			foodId: "",
			foodName: "",
			unit: "g",
			quantity: 0,
		});
	}

	async function handleSubmit(values: RecipeFormValues) {
		await saveRecipe({
			id: recipe?.id ?? undefined,
			name: values.name,
			instructions: values.instructions ?? null,
			servings: values.portions ?? recipe.servings,
			ingredients: values.ingredients.map(({ foodId, quantity, unit }) => ({
				foodId,
				quantity,
				unit,
				recipeId: recipe?.id,
			})),
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<div className="flex flex-col space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="gap-2">
							<FormField
								control={form.control}
								name="portions"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Portions</FormLabel>
										<FormControl>
											<Input
												type={"number"}
												inputMode={"decimal"}
												placeholder="Portions"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className="gap-2">
						<FormField
							control={form.control}
							name="instructions"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder="Describe the recipe" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className={"flex flex-col gap-y-4 mt-4"}>
					<div className="flex items-center justify-between">
						<FormLabel>Ingredients</FormLabel>
						<Button type="button" variant="secondary" onClick={handleAddIngredient}>
							Add ingredient
						</Button>
					</div>

					{fields.map((field, index) => (
						<div className={"flex gap-x-4 items-center"} key={field.id}>
							<FormField
								control={form.control}
								name={`ingredients.${index}.foodId`}
								render={({ field: foodField }) => (
									<FormItem className="flex-1">
										<FormControl>
											<Autocomplete
												defaultValue={
													foodField.value
														? {
																value: foodField.value,
																label: form.getValues(`ingredients.${index}.foodName`) ?? "",
															}
														: null
												}
												onChange={(option) => {
													foodField.onChange(option?.value ?? "");
													form.setValue(`ingredients.${index}.foodName`, option?.label ?? "");
												}}
												fetchOptions={async (query: string) => {
													return searchFood(query).then((food) =>
														food.map((food) => ({
															value: food.id,
															label: food.name,
														})),
													);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={`ingredients.${index}.quantity`}
								render={({ field }) => (
									<FormItem>
										<FormDescription />
										<FormControl>
											<Input type={"number"} className="w-24" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={`ingredients.${index}.unit`}
								render={({ field }) => (
									<FormItem>
										<FormDescription />
										<FormControl>
											<Input className="w-20" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="button" variant="ghost" onClick={() => remove(index)}>
								Remove
							</Button>
						</div>
					))}
				</div>

				<Button
					type="submit"
					disabled={form.formState.isSubmitting || !form.formState.isValid}
					className="w-full mt-4"
				>
					{form.formState.isSubmitting ? "Loading" : "Save"}
				</Button>
			</form>
		</Form>
	);
}
