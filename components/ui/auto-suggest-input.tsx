import { type KeyboardEvent, useCallback, useRef, useState } from "react";
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Product } from "@/utils/supabase/types";

type AutoCompleteProps = {
	value?: Product;
	onValueChange?: (value: Product) => void;
	disabled?: boolean;
	placeholder?: string;
	products: Product[];
};

export const ProductAutoComplete = ({
	placeholder,
	value,
	onValueChange,
	disabled,
	products,
}: AutoCompleteProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const [isOpen, setOpen] = useState(false);
	const [_selected, setSelected] = useState<Product | undefined>(value);
	const [inputValue, setInputValue] = useState<string>(value?.name || "");

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (!input) {
				return;
			}

			if (!isOpen) {
				setOpen(true);
			}

			if (event.key === "Enter" && input.value !== "") {
				const optionToSelect = products.find(
					(option) => option.name?.toString() === inputValue,
				);

				if (optionToSelect) {
					setSelected(optionToSelect);
					onValueChange?.(optionToSelect);

					setInputValue("");
				}
			}

			if (event.key === "Escape") {
				input.blur();
			}
		},
		[isOpen, products, onValueChange, inputValue],
	);

	const handleBlur = useCallback(() => {
		setOpen(false);
	}, []);

	const handleSelectOption = useCallback(
		(selectedOption: Product) => {
			setInputValue(selectedOption.name!);

			setSelected(selectedOption);
			onValueChange?.(selectedOption);
			setInputValue("");
			// This is a hack to prevent the input from being focused after the user selects an option
			// We can call this hack: "The next tick"
			setTimeout(() => {
				inputRef?.current?.blur();
			}, 0);
		},
		[onValueChange],
	);

	return (
		<Command onKeyDown={handleKeyDown}>
			<CommandInput
				ref={inputRef}
				value={inputValue}
				onValueChange={setInputValue}
				onBlur={handleBlur}
				onFocus={() => setOpen(true)}
				placeholder={placeholder}
				disabled={disabled}
			/>
			<div className="relative mt-1">
				<div className={cn(isOpen ? "block" : "hidden")}>
					<CommandList>
						{products.length > 0 ? (
							<CommandGroup>
								{products.map((option) => {
									return (
										<CommandItem
											key={option.id}
											value={`${option.id?.toString()} ${option.name}`}
											onMouseDown={(event: any) => {
												event.preventDefault();
												event.stopPropagation();
											}}
											onSelect={() => handleSelectOption(option)}
											className={cn("flex w-full items-center gap-2")}
										>
											<span>{option?.name}</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
						) : null}
					</CommandList>
				</div>
			</div>
		</Command>
	);
};
