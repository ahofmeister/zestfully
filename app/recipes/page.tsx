import React from "react";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { RecipeCard } from "@/app/recipes/recipe-card";
import { RecipeSearchBar } from "@/app/recipes/recipe-search-bar";

export default async function RecipesPage(props: {
  searchParams: Promise<{
    q: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
    let query = supabase.from("recipe").select("*");

    if (searchParams.q) {
        query = query.textSearch("name", searchParams.q, {config: 'english', type: 'websearch'});
    }

    const { data: recipes, error } = await query;
  return (
    <div className={"flex flex-col gap-y-4 p-1"}>
      <Link href={"/recipes/new"}>
        <Button size={"sm"}>
          <PlusIcon />
        </Button>
      </Link>
      <RecipeSearchBar value={searchParams.q} />
      <div className={"grid grid-cols-2 gap-2 mt-4 sm:grid-cols-3"}>
        {recipes?.map((recipe) => <RecipeCard recipe={recipe} />)}
      </div>
    </div>
  );
}
