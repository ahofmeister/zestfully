import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { dbTransaction } from "@/drizzle/client";
import { recipeSchema } from "@/drizzle/schema";

export default async function RecipePage(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;

	const recipe = await dbTransaction((tx) =>
		tx.query.recipeSchema.findFirst({
			where: eq(recipeSchema.id, params.id),
		}),
	);

	if (!recipe) {
		notFound();
	}

	return (
		<div>
			<div className={"text-2xl"}>{recipe.name}</div>
			<div className={""}>{recipe.instructions}</div>
			Ingredients
			{/*{recipe.ingredients?.map((ingredient) => (*/}
			{/*	<div key={ingredient.id}>{ingredient.product.name}</div>*/}
			{/*))}*/}
		</div>
	);
}
