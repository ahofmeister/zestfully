"use client";
import React, { useEffect, useState } from "react";
import { ShoppingListItemCard } from "@/app/shopping-list/[name]/shopping-list-item-card";
import { ShoppingList, ShoppingListItem } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/client";

function RealtimeShoppingListItems(props: {
  initialItems: ShoppingListItem[];
  shoppingList: ShoppingList;
}) {
  const supabase = createClient();
  const [items, setItems] = useState(props.initialItems);

  useEffect(() => {
    const channel = supabase
      .channel("shopping_list_items")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "shopping_list_item" },
        (payload) => {
          setItems((prevItems) => [
            ...prevItems,
            payload.new as ShoppingListItem,
          ]);
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
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "shopping_list_item" },
        (payload) => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === (payload.new as ShoppingListItem).id
                ? (payload.new as ShoppingListItem)
                : item,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase]);

  return items?.map((item) => (
    <ShoppingListItemCard
      key={item.id}
      item={item}
      shoppingListId={props.shoppingList.id}
    />
  ));
}

export default RealtimeShoppingListItems;
