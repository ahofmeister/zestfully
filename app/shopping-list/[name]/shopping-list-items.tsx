import { ShoppingList, ShoppingListItem } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/server";
import RealtimeShoppingListItems from "@/app/shopping-list/realtime-shopping-list-items";

export async function ShoppingListItems(props: { shoppingList: ShoppingList }) {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("shopping_list_item")
    .select("*")
    .eq("shopping_list_id", props.shoppingList.id);

  return (
    <div className={"mt-5 flex flex-wrap gap-1 content-start "}>
      <RealtimeShoppingListItems
        initialItems={items ?? []}
        shoppingList={props.shoppingList}
      />
    </div>
  );
}
