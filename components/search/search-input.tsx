"use client";

import { SearchIcon } from "lucide-react";
import { debounce, parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";

const SearchInput = ({ placeholder, queryKey }: { placeholder?: string; queryKey?: string }) => {
	const [query, setQuery] = useQueryState(
		queryKey ? queryKey : "query",
		parseAsString.withDefault("").withOptions({
			shallow: false,
		}),
	);

	const debouncedUpdate = useMemo(() => debounce(200), []);

	return (
		<div className="relative">
			<SearchIcon
				aria-hidden="true"
				focusable={false}
				size={14}
				className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-text-secondary"
			/>
			<Input
				type="search"
				className="pl-8"
				onChange={async (event) => {
					const newValue = event.target.value;
					await setQuery(newValue, {
						limitUrlUpdates: newValue === "" ? undefined : debouncedUpdate,
					});
				}}
				onKeyDown={async (event) => {
					if (event.key === "Enter") {
						await setQuery(event.currentTarget.value);
					}
				}}
				value={query}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default SearchInput;
