"use client";
import { Product, ShoppingListItemWithProduct } from "@/utils/supabase/types";
import { cn } from "@/lib/utils";
import {
  addShoppingListEntry,
  deleteShoppingListItem,
} from "@/app/shopping-list/shopping-list-actions";

export function ShoppingListProductCard(props: {
  item?: ShoppingListItemWithProduct;
  product: Product;
  shoppingListId: string;
}) {
  return (
    <div
      onClick={() => {
        if (props.item) {
          return deleteShoppingListItem(props.item.id);
        } else {
          return addShoppingListEntry(props.product, props.shoppingListId);
        }
      }}
      key={props.product.id}
      className={cn(
        "cursor-pointer content-start aspect-square size-24 line-clamp-3 rounded-sm flex text-center bg-teal-700 items-center justify-center",
        { "bg-red-500": !props.item },
      )}
    >
      {props.product.name}
    </div>
  );
}
