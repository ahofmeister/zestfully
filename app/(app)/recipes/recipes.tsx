import { ilike } from "drizzle-orm";
import { RecipeCard } from "@/app/(app)/recipes/recipe-card";
import { dbTransaction } from "@/drizzle/client";
import { recipeSchema } from "@/drizzle/schema";

export async function Recipes(props: { query: string }) {
	const recipes = await dbTransaction((tx) =>
		tx.query.recipeSchema.findMany({
			where: props.query ? ilike(recipeSchema.name, `%${props.query}%`) : undefined,
		}),
	);

	if (recipes?.length === 0) {
		return <div>No recipes found.</div>;
	}

	return (
		<div className={"grid grid-cols-2 gap-2 mt-4 sm:grid-cols-4"}>
			{recipes?.map((recipe) => (
				<RecipeCard key={recipe.id} recipe={recipe} />
			))}
		</div>
	);
}
