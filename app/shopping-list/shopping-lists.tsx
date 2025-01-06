import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Trash2 } from "lucide-react";
import { DeleteShoppingList } from "@/app/shopping-list/delete-shopping-list";

export async function ShoppingLists() {
  const supabase = await createClient();
  const { data: lists } = await supabase.from("shopping_list").select("*");
  return (
    <div className={"flex flex-col gap-y-4"}>
      {lists?.map((list) => (
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">{list.name}</CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="secondary"
              size="iconSm"
              disabled={true}
              aria-label="Share item"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <DeleteShoppingList id={list.id} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
