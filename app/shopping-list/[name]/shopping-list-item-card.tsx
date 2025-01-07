"use client";
import { ShoppingListItem } from "@/utils/supabase/types";
import { addShoppingListItem } from "@/app/shopping-list/shopping-list-actions";

export function ShoppingListItemCard(props: {
  item: ShoppingListItem;
  shoppingListId: string;
}) {
  const item = props.item;
  return (
    <div
      onClick={() => {
        void addShoppingListItem(item.item, props.shoppingListId);
      }}
      key={item.id}
      className={
        "cursor-pointer content-start aspect-square size-24 line-clamp-3 rounded-sm flex text-center bg-teal-700 items-center justify-center"
      }
    >
      {item.item}
    </div>
  );
}
