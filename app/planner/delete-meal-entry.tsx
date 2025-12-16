"use client";
import { X } from "lucide-react";
import React from "react";
import { deleteMeal } from "@/app/planner/planner-actions";
import { Button } from "@/components/ui/button";

const DeleteMealEntry = (props: { id: string }) => {
	return (
		<div>
			<Button
				size={"sm"}
				variant={"outline"}
				onClick={() => deleteMeal(props.id)}
			>
				<X size={"12"} />
			</Button>
		</div>
	);
};

export default DeleteMealEntry;
