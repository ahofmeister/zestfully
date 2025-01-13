import React from 'react';
import {createClient} from "@/utils/supabase/server";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PlusIcon} from "lucide-react";
import {RecipeCard} from "@/app/recipes/recipe-card";

const RecipesPage = async () => {
    const supabase = await createClient();
    const {data: recipes} = await supabase.from("recipe").select("*")
    return (
        <div>
            <Link href={"/recipes/new"}>
                <Button size={"sm"}>
                    <PlusIcon/>
                </Button>
            </Link>
            <div className={"grid grid-cols-2 gap-2 mt-4 sm:grid-cols-3"}>
                {recipes?.map((recipe) => (
                    <RecipeCard recipe={recipe}/>
                ))}
            </div>
        </div>
    );
};

export default RecipesPage;