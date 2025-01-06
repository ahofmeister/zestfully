"use client";
import { Button } from "@/components/ui/button";
import { deleteShoppingList } from "@/app/shopping-list/shopping-list-actions";
import {Trash2} from "lucide-react";

export function DeleteShoppingList(props: { id: string }) {
  return (
      <Button
          variant="destructive"
          size="iconSm"
          onClick={() => deleteShoppingList(props.id)}
          aria-label="Delete list"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
  );
}
