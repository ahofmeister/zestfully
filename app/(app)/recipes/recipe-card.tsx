"use client";
import { UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteRecipe from "@/app/(app)/recipes/delete-recipe";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { recipeSchema } from "@/drizzle/schema";

export function RecipeCard(props: { recipe: typeof recipeSchema.$inferSelect }) {
	const recipe = props.recipe;
	const router = useRouter();
	return (
		<Card onClick={() => router.push(`/recipes/${recipe.id}`)} className={"cursor-pointer"}>
			<CardHeader>
				<CardTitle>{recipe.name}</CardTitle>
				<CardDescription className={"flex gap-x-4"}>
					{recipe.servings && (
						<span className={"flex gap-x-2 items-center"}>
							<UtensilsCrossed size={"18"} />
							{recipe.servings}
						</span>
					)}

					{/*{recipe.time && (*/}
					{/*  <span className={"flex gap-x-2 items-center"}>*/}
					{/*    <Clock size={"18"} />*/}
					{/*    {recipe.time} min*/}
					{/*  </span>*/}
					{/*)}*/}
				</CardDescription>
			</CardHeader>
			<CardContent>{recipe.instructions}</CardContent>

			<CardFooter>
				<DeleteRecipe id={recipe.id} />
			</CardFooter>
		</Card>
	);
}
