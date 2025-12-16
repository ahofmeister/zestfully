"use client";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { addEntryWithNewProduct } from "@/app/shopping-list/shopping-list-actions";
import { ShoppingListProductCard } from "@/app/shopping-list/shopping-list-product-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
	Product,
	ShoppingListWithEntriesAndProduct,
} from "@/utils/supabase/types";

export function AddShoppingListItem(props: {
	shoppingList: ShoppingListWithEntriesAndProduct;
	products: Product[];
}) {
	const [openModal, setOpenModal] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [products, setProducts] = useState<
		(Product | Pick<Product, "name" | "id">)[]
	>(props.products);

	return (
		<div className={"flex gap-x-4"}>
			<Button size={"icon"} onClick={() => setOpenModal(true)}>
				<SearchIcon />
			</Button>

			<Dialog open={openModal} onOpenChange={setOpenModal}>
				<DialogContent
					className={"flex flex-col min-w-full and h-screen justify-between"}
				>
					<DialogTitle className={""}>
						Add to {props.shoppingList.name}
					</DialogTitle>
					<ScrollArea
						className={"mt-5 flex flex-wrap gap-1 content-start flex-1"}
					>
						<div className={"flex flex-wrap gap-1 content-start flex-1"}>
							{products
								?.filter((product) =>
									product.name.toLowerCase().includes(inputValue.toLowerCase()),
								)
								.sort((a, b) =>
									a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
								)
								.map((product) => (
									<ShoppingListProductCard
										key={product.id}
										item={props.shoppingList.entries.find(
											(entry) => entry.product.id === product.id,
										)}
										product={product}
										shoppingListId={props.shoppingList.id}
									/>
								))}
							{inputValue &&
								!products.find(
									(product) =>
										product.name.toLowerCase() === inputValue.toLowerCase(),
								) && (
									<div
										onClick={() =>
											addEntryWithNewProduct(
												inputValue.trim(),
												props.shoppingList.id,
											).then((newProduct) => {
												if (newProduct) {
													setProducts([...products, newProduct.product]);
												}
											})
										}
									>
										<ShoppingListProductCard
											product={{
												name: inputValue,
												id: Math.random().toString(36).slice(2, 7),
											}}
											shoppingListId={props.shoppingList.id}
										/>
									</div>
								)}
						</div>
					</ScrollArea>
					<Input
						className={"mb-4"}
						value={inputValue}
						onChange={(e) => setInputValue(e.currentTarget.value)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
