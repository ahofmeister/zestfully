import React from 'react';
import {createClient} from "@/utils/supabase/server";

export default async function RecipePage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const supabase = await createClient();
    const {data: recipe} = await supabase
        .from("recipe")
        .select("*")
        .eq("id", params.id)
        .single();

    return <div>{recipe?.name}</div>;
}
