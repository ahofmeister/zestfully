"use client";
import { Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteShoppingList } from "@/app/shopping-list/delete-shopping-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ShoppingList } from "@/utils/supabase/types";

export function ShoppingListCard(props: { list: ShoppingList }) {
	const router = useRouter();
	return (
		<Card
			className="w-full max-w-md cursor-pointer"
			onClick={() =>
				router.push(`/shopping-list/${encodeURIComponent(props.list.name)}`)
			}
		>
			<CardContent className="pt-6">{props.list.name}</CardContent>
			<CardFooter className="flex justify-between">
				<Button
					variant="secondary"
					size="iconSm"
					disabled={true}
					aria-label="Share item"
				>
					<Share2 className="h-4 w-4" />
				</Button>
				<DeleteShoppingList id={props.list.id} />
			</CardFooter>
		</Card>
	);
}
