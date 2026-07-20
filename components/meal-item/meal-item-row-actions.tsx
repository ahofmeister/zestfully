"use client";
import { EllipsisVerticalIcon, TrashIcon } from "lucide-react";
import { deleteMealItem } from "@/components/meal-item/meal-item-actions";
import { Button } from "@/components/ui/button";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MealItemRowActions = ({ id }: { id: string }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="iconSm">
					<EllipsisVerticalIcon className="size-4 text-gray-400" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => deleteMealItem(id)}>
					<TrashIcon className="size-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default MealItemRowActions;
