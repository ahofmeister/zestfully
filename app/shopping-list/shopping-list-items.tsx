"use client";
import { useEffect, useState } from "react";
import { ShoppingListProductCard } from "@/app/shopping-list/shopping-list-product-card";
import { createClient } from "@/utils/supabase/client";
import type {
	ShoppingListItem,
	ShoppingListItemWithProduct,
	ShoppingListWithEntriesAndProduct,
} from "@/utils/supabase/types";

function ShoppingListItems(props: {
	shoppingList: ShoppingListWithEntriesAndProduct;
}) {
	const supabase = createClient();
	const [items, setItems] = useState(props.shoppingList.entries);

	useEffect(() => {
		const channel = supabase
			.channel("shopping-list-items")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "shopping_list_item" },
				(payload) => {
					const newItem = payload.new as ShoppingListItemWithProduct;
					supabase
						.from("shopping_list_item")
						.select("*, product(*)")
						.eq("id", newItem.id)
						.single()
						.then((response) => {
							if (response.data) {
								setItems((prevItems) => [...prevItems, response.data]);
							}
						});
				},
			)
			.on(
				"postgres_changes",
				{ event: "DELETE", schema: "public", table: "shopping_list_item" },
				(payload) => {
					setItems((prevItems) =>
						prevItems.filter(
							(item) => item.id !== (payload.old as ShoppingListItem).id,
						),
					);
				},
			)
			.subscribe();

		return () => {
			void supabase.removeChannel(channel);
		};
	}, [supabase]);

	return (
		<div className={"flex flex-wrap gap-1"}>
			{items?.map((entry) => (
				<ShoppingListProductCard
					key={entry.id}
					item={entry}
					product={entry.product}
					shoppingListId={props.shoppingList.id}
				/>
			))}
		</div>
	);
}

export default ShoppingListItems;
