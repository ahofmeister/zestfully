import Link from "next/link";
import { notFound } from "next/navigation";
import { calculateNutrients } from "@/app/(app)/home/nutrition-calculation";
import DeleteRecipe from "@/app/(app)/recipes/delete-recipe";
import { dbTransaction } from "@/drizzle/client";
import { cn } from "@/lib/utils";

export default async function RecipePage(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;

	const recipe = await dbTransaction((tx) =>
		tx.query.recipeSchema.findFirst({
			where: {
				id: {
					eq: params.id,
				},
			},
			with: {
				ingredients: {
					with: {
						food: true,
					},
				},
			},
		}),
	);

	if (!recipe) {
		notFound();
	}

	const totalNutrients = calculateNutrients(
		recipe.ingredients.map((ingredient) => ({
			quantity: ingredient.quantity,
			nutrients: ingredient.food,
		})),
	);

	const nutrientsPerServing = {
		energy: totalNutrients.energy / recipe.servings,
		protein: totalNutrients.protein / recipe.servings,
		carbohydrates: totalNutrients.carbohydrates / recipe.servings,
		fat: totalNutrients.fat / recipe.servings,
	};

	return (
		<div className="mx-auto max-w-3xl space-y-8">
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="text-3xl font-semibold tracking-tight">{recipe.name}</h1>

						<p className="mt-1 text-sm text-muted-foreground">
							{recipe.servings} {recipe.servings === 1 ? "serving" : "servings"}
						</p>
					</div>

					<div className="flex items-center gap-4 text-sm">
						<Link
							href={`/recipes/${recipe.id}/edit`}
							className="text-muted-foreground hover:text-foreground"
						>
							Edit
						</Link>

						<DeleteRecipe id={recipe.id} />
					</div>
				</div>
			</div>

			<section className="rounded-xl border bg-card p-5">
				<div className="mb-4 flex items-baseline justify-between">
					<h2 className="text-lg font-medium">Nutrition</h2>

					<span className="text-sm text-muted-foreground">per serving</span>
				</div>

				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					<Nutrient label="Energy" value={nutrientsPerServing.energy} unit="kcal" />

					<Nutrient label="Protein" value={nutrientsPerServing.protein} unit="g" />

					<Nutrient label="Carbohydrates" value={nutrientsPerServing.carbohydrates} unit="g" />

					<Nutrient label="Fat" value={nutrientsPerServing.fat} unit="g" />
				</div>

				<div className="mt-4 border-t pt-3 text-sm text-muted-foreground">
					Total recipe: {totalNutrients.energy} kcal · {totalNutrients.protein} g protein ·{" "}
					{totalNutrients.carbohydrates} g carbs · {totalNutrients.fat} g fat
				</div>
			</section>

			<section>
				<h2>Instructions</h2>
				{recipe.instructions && (
					<p className="whitespace-pre-line text-muted-foreground">{recipe.instructions}</p>
				)}
			</section>

			<section className="space-y-3">
				<h2 className="text-lg font-medium">Ingredients</h2>

				<div className="divide-y rounded-xl border">
					{recipe.ingredients.map((ingredient) => {
						const nutrients = calculateNutrients({
							quantity: ingredient.quantity,
							nutrients: ingredient.food,
						});

						return (
							<div
								key={ingredient.id}
								className="flex items-center justify-between gap-4 px-4 py-3"
							>
								<div className="min-w-0">
									<p className="font-medium">{ingredient.food.name}</p>

									<p className="text-sm text-muted-foreground">
										{ingredient.quantity}
										{ingredient.unit}
									</p>
								</div>

								<div className="shrink-0 text-right text-sm text-muted-foreground">
									<p>{nutrients.energy} kcal</p>
									<p>{nutrients.protein} g protein</p>
								</div>
							</div>
						);
					})}
				</div>
			</section>
		</div>
	);
}

function Nutrient({ label, value, unit }: { label: string; value: number; unit: string }) {
	return (
		<div className={cn("space-y-0.5")}>
			<p className="text-xs text-muted-foreground">{label}</p>

			<p className="text-lg font-medium">
				{value}
				{unit && ` ${unit}`}
			</p>
		</div>
	);
}
