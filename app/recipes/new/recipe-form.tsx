"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { saveRecipe } from "@/app/recipes/recipe-actions";
import { ProductAutoComplete } from "@/components/ui/auto-suggest-input";
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
import { createClient } from "@/utils/supabase/client";
import type { NewRecipe, Product } from "@/utils/supabase/types";

const recipeSchema = z.object({
	name: z.string().min(3),
	description: z.string().optional(),
	portions: z.coerce.number().optional(),
	time: z.coerce.number().optional(),
	source: z.string().optional(),
	ingredients: z.array(
		z.object({
			id: z.string(),
			food_id: z.string(),
			amount: z.coerce.number(),
			unit: z.string(),
			recipe_id: z.string(),
		}),
	),
});

export function RecipeForm() {
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		async function fetchFoods() {
			const supabase = createClient();
			const { data: products } = await supabase.from("product").select("*");
			setProducts(products ?? []);
		}

		void fetchFoods();
	}, []);

	const form = useForm<z.infer<typeof recipeSchema>>({
		resolver: zodResolver(recipeSchema),
		defaultValues: {
			name: "",
			description: "",
			portions: 2,
			time: 30,
			source: "",
			ingredients: [],
		},
		mode: "onBlur",
	});

	const { fields, append } = useFieldArray({
		control: form.control,
		name: "ingredients",
	});

	async function handleSubmit(recipe: NewRecipe) {
		await saveRecipe(recipe);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((recipe) => handleSubmit({ ...recipe }))}
			>
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

						<FormField
							control={form.control}
							name="time"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Time</FormLabel>
									<FormControl>
										<Input
											type={"number"}
											placeholder="Time in minutes"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="source"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Source</FormLabel>
									<FormControl>
										<Input placeholder="Source of the recipe" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="gap-2">
						<FormField
							control={form.control}
							name="description"
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
					<FormLabel>Ingredients</FormLabel>
					<ProductAutoComplete
						onValueChange={(value) =>
							append({
								id: value.id,
								unit: "g",
								amount: 0,
								food_id: value.id,
								recipe_id: "",
							})
						}
						products={products}
					/>
				</div>

				{fields.map((field, index) => (
					<div className={"flex gap-x-4 items-center"} key={field.id}>
						{products.find((food) => food.id === field.food_id)?.name}
						<FormField
							control={form.control}
							name={`ingredients.${index}.amount`}
							render={({ field }) => (
								<FormItem>
									<FormDescription />
									<FormControl>
										<Input type={"number"} {...field} />
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
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				))}

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
