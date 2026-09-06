import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Recipes } from "@/app/(app)/recipes/recipes";
import SearchInput from "@/components/search/search-input";
import { Button } from "@/components/ui/button";

export default async function RecipesPage(props: {
	searchParams: Promise<{
		query: string;
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
			<SearchInput />
			<Suspense fallback={<div>Loading recipes</div>}>
				<Recipes query={searchParams.query} />
			</Suspense>
		</div>
	);
}
