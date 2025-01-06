import React from "react";
import { CreateShoppingList } from "@/app/shopping-list/create-shopping-list";
import { ShoppingLists } from "@/app/shopping-list/shopping-lists";

const ShoppingListPage = () => {
  return (
    <div className={"flex flex-col gap-y-4"}>
      <ShoppingLists />
      <CreateShoppingList />
    </div>
  );
};

export default ShoppingListPage;
