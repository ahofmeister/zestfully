"use client"
import {Recipe} from "@/utils/supabase/types";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Clock, UtensilsCrossed} from "lucide-react";
import DeleteRecipe from "@/app/recipes/delete-recipe";
import React from "react";
import {useRouter} from "next/navigation";

export function RecipeCard(props: { recipe: Recipe }) {
    const recipe = props.recipe;
    const router = useRouter()
    return <Card onClick={() => router.push(`/dashboard/recipes/${recipe.id}`)}>
        <CardHeader>
            <CardTitle>{recipe.name}</CardTitle>
            <CardDescription className={"flex gap-x-4"}>
                {recipe.portions &&
                    <span className={"flex gap-x-2 items-center"}>
                        <UtensilsCrossed size={"18"}/>
                        {recipe.portions}
                   </span>}

                {recipe.time &&
                    <span className={"flex gap-x-2 items-center"}>
                        <Clock size={"18"}/>
                        {recipe.time} min
                   </span>}
            </CardDescription>
        </CardHeader>
        <CardContent>
            {recipe.description}
        </CardContent>

        <CardFooter>
            <DeleteRecipe id={recipe.id}/>
        </CardFooter>
    </Card>;
}