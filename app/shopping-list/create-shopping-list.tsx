"use client";
import React, { type FormEvent } from "react";
import { createShoppingList } from "@/app/shopping-list/shopping-list-actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

async function onSubmit(event: FormEvent<HTMLFormElement>) {
	event.preventDefault();
	const formData = new FormData(event.currentTarget);
	void createShoppingList(formData.get("name") as string);
}

export function CreateShoppingList() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size={"sm"}>New List</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create list</DialogTitle>
				</DialogHeader>
				<form onSubmit={onSubmit}>
					<Input
						name={"name"}
						required
						placeholder={"Insert fancy name here"}
					/>

					<DialogFooter className={"mt-2"}>
						<Button type={"submit"}>Create</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
