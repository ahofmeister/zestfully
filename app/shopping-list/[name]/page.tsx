import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { AddShoppingListItem } from "@/app/shopping-list/[name]/add-shopping-list-item";
import { ShoppingListItems } from "@/app/shopping-list/[name]/shopping-list-items";

export default async function ShoppingListPage(props: {
  params: Promise<{ name: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: shoppingList } = await supabase
    .from("shopping_list")
    .select("*")
    .eq("name", decodeURIComponent(params.name))
    .single();

  if (!shoppingList) {
    notFound();
  }

  return (
    <div className={"p-2"}>
      <div className={"flex justify-between sm:justify-evenly"}>
        <div className={"text-xl"}>{shoppingList?.name}</div>
        <AddShoppingListItem shoppingList={shoppingList} />
      </div>
      <ShoppingListItems shoppingList={shoppingList} />
    </div>
  );
}
