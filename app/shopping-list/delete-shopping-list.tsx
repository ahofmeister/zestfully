"use client";
import { Trash2 } from "lucide-react";
import { deleteShoppingList } from "@/app/shopping-list/shopping-list-actions";
import { Button } from "@/components/ui/button";

export function DeleteShoppingList(props: { id: string }) {
	return (
		<Button
			variant="destructive"
			size="iconSm"
			onClick={(event) => {
				event.stopPropagation();
				return deleteShoppingList(props.id);
			}}
			aria-label="Delete list"
		>
			<Trash2 className="h-4 w-4" />
		</Button>
	);
}
