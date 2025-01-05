"use client"
import React from 'react';
import {Button} from "@/components/ui/button";
import {deleteRecipe} from "@/app/recipes/recipe-actions";

const DeleteRecipe = (props: {id: string}) => {
    return (
        <Button variant="destructive" size={"sm"} onClick={() => deleteRecipe(props.id)}>
            Delete
        </Button>
    );
};

export default DeleteRecipe;