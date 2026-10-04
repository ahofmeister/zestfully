import { Button } from "@base-ui/react";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { recipeToCategoriesSchema } from "@/drizzle/schema";
import { cn } from "@/lib/utils";

async function RecipeCategoriesList() {
	const recipeCategories = await dbTransaction((tx) =>
		tx.query.recipeCategorySchema.findMany({
			extras: {
				recipeCount: (t) =>
					tx.$count(recipeToCategoriesSchema, eq(recipeToCategoriesSchema.categoryId, t.id)),
			},
		}),
	);

	return (
		<div>
			{recipeCategories.map((category) => {
				return (
					<Card
						key={category.id}
						className={cn("flex flex-col justify-between")}
						style={{ color: category.color ?? "" }}
					>
						<CardHeader>
							<CardTitle>{category.name}</CardTitle>
						</CardHeader>
						<CardFooter>{category.recipeCount}</CardFooter>
					</Card>
				);
			})}
		</div>
	);
}

const RecipeCategories = () => {
	return (
		<div>
			<Suspense>
				<Link href="/recipe-categories/new">
					<Button>New Recipe</Button>
				</Link>
				<RecipeCategoriesList />
			</Suspense>
		</div>
	);
};

export default RecipeCategories;
