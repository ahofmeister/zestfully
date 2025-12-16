import { RecipeCard } from "@/app/recipes/recipe-card";
import { createClient } from "@/utils/supabase/server";

export async function Recipes(props: { searchTerm: string }) {
	const supabase = await createClient();
	let query = supabase.from("recipe").select("*");

	if (props.searchTerm) {
		query = query.textSearch("name", props.searchTerm, {
			config: "english",
			type: "websearch",
		});
	}

	const { data: recipes } = await query;

	return (
		<div className={"grid grid-cols-2 gap-2 mt-4 sm:grid-cols-4"}>
			{recipes?.map((recipe) => (
				<RecipeCard key={recipe.id} recipe={recipe} />
			))}
		</div>
	);
}
