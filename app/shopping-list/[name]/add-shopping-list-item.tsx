"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { ShoppingList, ShoppingListItem } from "@/utils/supabase/types";
import { ShoppingListItemCard } from "@/app/shopping-list/[name]/shopping-list-item-card";

export function AddShoppingListItem(props: { shoppingList: ShoppingList }) {
  const [openModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const groceries = [
    {
      item: "Apple",
    },
    {
      item: "Banana",
    },
    {
      item: "Spinach",
    },
    {
      item: "Carrot",
    },
    {
      item: "Brown Rice",
    },
    {
      item: "Quinoa",
    },
    {
      item: "Black Beans",
    },
    {
      item: "Chickpeas",
    },
    {
      item: "Almonds",
    },
    {
      item: "Chia Seeds",
    },
    {
      item: "Almond Milk",
    },
    {
      item: "Oat Milk",
    },
    {
      item: "Vegan Potato Chips",
    },
    {
      item: "Vegan Chocolate Cookies",
    },
  ] as ShoppingListItem[];

  return (
    <div className={"flex gap-x-4"}>
      <Button size={"icon"} onFocus={() => setOpenModal(true)}>
        <SearchIcon />
      </Button>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className={"flex flex-col min-w-full and h-screen justify-between"}>
          <div className={"mt-5 flex flex-wrap gap-1 content-start"}>
            {groceries
              .filter((item) =>
                item.item.toLowerCase().includes(inputValue.toLowerCase()),
              )
              .map((item) => (
                <ShoppingListItemCard
                  key={item.item}
                  item={item}
                  shoppingListId={props.shoppingList.id}
                />
              ))}
          </div>
          <Input className={"mb-4"}
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
