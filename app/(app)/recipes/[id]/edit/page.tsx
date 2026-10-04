import { notFound } from "next/navigation";
import { RecipeForm } from "@/app/(app)/recipes/new/recipe-form";
import { dbTransaction } from "@/drizzle/client";

export default async function RecipeEditPage(props: { params: Promise<{ id: string }> }) {
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

	return <RecipeForm recipe={recipe} />;
}
