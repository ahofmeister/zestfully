"use client";
import { CopyIcon, EllipsisVerticalIcon, TrashIcon } from "lucide-react";
import { copyMealItems, deleteMealItems } from "@/components/meal-item/meal-item-actions";
import { capitalizeFirstLetter } from "@/components/strings";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type MealItemWithFood, type MealType, mealTypes } from "@/drizzle/schema";

export function MealActionsButton({ items }: { items: MealItemWithFood[] }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="iconSm">
					<EllipsisVerticalIcon className="size-4 text-gray-400" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<CopyMealItemsDialog items={items} />
				<DeleteMealItemsDialog items={items} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const CopyMealItemsDialog = ({ items }: { items: MealItemWithFood[] }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					<CopyIcon className="size-4" />
					Copy Meal Items
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Copy Meal Items</DialogTitle>
				</DialogHeader>
				<form
					action={async (formData: FormData) => {
						const mealType = formData.get("mealType") as MealType;
						await copyMealItems(mealType, items);
					}}
				>
					<Select name="mealType" required>
						<SelectTrigger>
							<SelectValue placeholder="Select meal type" />
						</SelectTrigger>
						<SelectContent>
							{mealTypes.map((mealType) => (
								<SelectItem key={mealType} value={mealType}>
									{capitalizeFirstLetter(mealType)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<DialogFooter>
						<Button type="submit">Copy</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

const DeleteMealItemsDialog = ({ items }: { items: MealItemWithFood[] }) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					<TrashIcon className="size-4" />
					Delete Meal Items
				</DropdownMenuItem>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Meal Items</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => deleteMealItems(items.map((item) => item.id))}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
