"use client";
import React from "react";
import { deleteRecipe } from "@/app/recipes/recipe-actions";
import { Button } from "@/components/ui/button";

const DeleteRecipe = (props: { id: string }) => {
	return (
		<Button
			variant="destructive"
			size={"sm"}
			onClick={() => deleteRecipe(props.id)}
		>
			Delete
		</Button>
	);
};

export default DeleteRecipe;
