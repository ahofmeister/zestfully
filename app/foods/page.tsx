import React from 'react';
import {createClient} from "@/utils/supabase/server";
import { Food } from "@/utils/supabase/types";

function FoodCard(props: { food: Food }) {
    return <div>{props.food.name}</div>;
}

const FoodPage = async () => {
    const supabase = await createClient()
    const {data: foods} = await supabase.from("food").select("*").order("name")
    return (
        <div>
            {foods?.map(food => <FoodCard food={food}/>)}
        </div>
    )
}

export default FoodPage;