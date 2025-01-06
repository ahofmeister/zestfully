import { createClient } from "@/utils/supabase/server";
import { ShoppingListCard } from "@/app/shopping-list/shopping-list-card";

export async function ShoppingLists() {
  const supabase = await createClient();
  const { data: lists } = await supabase.from("shopping_list").select("*");
  return (
    <div className={"flex flex-col gap-y-4"}>
      {lists?.map((list) => <ShoppingListCard list={list} />)}
    </div>
  );
}
