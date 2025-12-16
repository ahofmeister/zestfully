import { notFound } from "next/navigation";
import { AddShoppingListItem } from "@/app/shopping-list/add-shopping-list-item";
import ShoppingListItems from "@/app/shopping-list/shopping-list-items";
import { createClient } from "@/utils/supabase/server";

export default async function ShoppingListPage(props: {
	params: Promise<{ name: string }>;
}) {
	const params = await props.params;
	const supabase = await createClient();
	const { data: shoppingList } = await supabase
		.from("shopping_list")
		.select("*, entries:shopping_list_item(*, product(*))")
		.eq("name", decodeURIComponent(params.name))
		.single();

	if (!shoppingList) {
		notFound();
	}

	const { data: items } = await supabase.from("product").select("*");

	return (
		<div className={"p-2"}>
			<div className={"flex justify-between mb-2"}>
				<div className={"text-xl"}>{shoppingList.name}</div>
				<AddShoppingListItem
					shoppingList={shoppingList}
					products={items ?? []}
				/>
			</div>
			<ShoppingListItems shoppingList={shoppingList ?? []} />
		</div>
	);
}
