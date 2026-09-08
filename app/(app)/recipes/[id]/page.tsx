import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteRecipe from "@/app/(app)/recipes/delete-recipe";
import { dbTransaction } from "@/drizzle/client";
import { recipeSchema } from "@/drizzle/schema";

export default async function RecipePage(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;

	const recipe = await dbTransaction((tx) =>
		tx.query.recipeSchema.findFirst({
			where: eq(recipeSchema.id, params.id),
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

	return (
		<div>
			<div className={"text-2xl"}>{recipe.name}</div>
			<DeleteRecipe id={recipe.id} />
			<div className={""}>{recipe.instructions}</div>
			<Link href={`/recipes/${recipe.id}/edit`}>Edit</Link>
			<p>Ingredients</p>
			{recipe.ingredients?.map((ingredient) => (
				<div key={ingredient.id}>{ingredient.food.name}</div>
			))}
		</div>
	);
}
