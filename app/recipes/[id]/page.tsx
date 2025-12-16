import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { FulLRecipe } from "@/utils/supabase/types";

export default async function RecipePage(props: {
	params: Promise<{ id: string }>;
}) {
	const params = await props.params;
	const supabase = await createClient();
	const { data: recipe } = await supabase
		.from("recipe")
		.select("*, ingredients:ingredient(*, product(*))")
		.eq("id", params.id)
		.returns<FulLRecipe[]>()
		.single();

	if (!recipe) {
		notFound();
	}

	return (
		<div>
			<div className={"text-2xl"}>{recipe.name}</div>
			<div className={""}>{recipe.description}</div>
			Ingredients
			{recipe.ingredients?.map((ingredient) => (
				<div key={ingredient.id}>{ingredient.product.name}</div>
			))}
		</div>
	);
}
