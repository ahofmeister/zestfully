import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function ShoppingListPage(props: {
  params: Promise<{ name: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: list } = await supabase
    .from("shopping_list")
    .select("*")
    .eq("name", decodeURIComponent(params.name))
    .single();

  if (!list) {
    notFound();
  }

  return (
    <div className={"p-2"}>
      <div className={"text-xl"}>{list?.name}</div>
    </div>
  );
}
