"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export const createShoppingList = async (name: string) => {
	const supabase = await createClient();
	const { error } = await supabase.from("shopping_list").insert({ name: name });

	if (error) {
		console.log(error);
	} else {
		revalidatePath("/shopping-list", "page");
	}
};

export const deleteShoppingList = async (id: string) => {
	const supabase = await createClient();
	const { error } = await supabase.from("shopping_list").delete().eq("id", id);

	if (error) {
		console.log(error);
	} else {
		revalidatePath("/shopping-list", "page");
	}
};

export const deleteShoppingListItem = async (id: string) => {
	const supabase = await createClient();
	const { error } = await supabase
		.from("shopping_list_item")
		.delete()
		.eq("id", id);

	if (error) {
		console.log(error);
	} else {
		revalidatePath("/");
	}
};

export const addShoppingListItem = async (
	product_id: string,
	shopping_list_id: string,
) => {
	const supabase = await createClient();
	const { error } = await supabase
		.from("shopping_list_item")
		.insert({ product_id, shopping_list_id })
		.select("*");

	if (error) {
		console.log("error there");
		console.log(error);
	} else {
		revalidatePath("/");
	}
	return;
};

export const addEntryWithNewProduct = async (
	name: string,
	shoppingListId: string,
) => {
	const supabase = await createClient();
	const { data: productData, error } = await supabase
		.from("product")
		.insert({ name })
		.select("*")
		.single();

	if (error) {
		console.log(error);
	}

	if (productData) {
		const { error, data: shoppingItemData } = await supabase
			.from("shopping_list_item")
			.insert({ product_id: productData.id, shopping_list_id: shoppingListId })
			.select("*, product(*)")
			.single();

		if (error) {
			console.log("error there");
			console.log(error);
		} else {
			revalidatePath("/");
			return shoppingItemData;
		}
	}
};
