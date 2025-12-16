import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { RecipeSearchBar } from "@/app/recipes/recipe-search-bar";
import { Recipes } from "@/app/recipes/recipes";
import { Button } from "@/components/ui/button";

export default async function RecipesPage(props: {
	searchParams: Promise<{
		q: string;
	}>;
}) {
	const searchParams = await props.searchParams;

	return (
		<div className={"flex flex-col gap-y-4 p-1"}>
			<Link href={"/recipes/new"}>
				<Button size={"sm"}>
					<PlusIcon />
				</Button>
			</Link>
			<RecipeSearchBar value={searchParams.q} />
			<Suspense fallback={<div>Loading recipes</div>}>
				<Recipes searchTerm={searchParams.q} />
			</Suspense>
		</div>
	);
}
