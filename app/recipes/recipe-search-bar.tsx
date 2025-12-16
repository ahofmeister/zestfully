"use client";
import { useState } from "react";
import useUpdateQueryParams from "@/app/use-update-query-params";
import { Input } from "@/components/ui/input";

export function RecipeSearchBar(props: { value: string }) {
	const [searchTerm, setSearchTerm] = useState<string | undefined>(
		props.value ?? "",
	);

	const stuff = useUpdateQueryParams();

	return (
		<Input
			type={"search"}
			value={searchTerm}
			onChange={(event) => {
				const newValue = event.target.value;
				stuff({ value: newValue, key: "q" });
				return setSearchTerm(newValue);
			}}
		/>
	);
}
