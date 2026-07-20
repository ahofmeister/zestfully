import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import {
	type ChangeEvent,
	type KeyboardEvent,
	type MouseEvent,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";

type Option = {
	value: string;
	label: string;
	sublabel?: string;
};

type AutocompleteProps = {
	label?: string;
	name?: string;
	placeholder?: string;
	fetchOptions: (query: string) => Promise<Option[]>;
	minChars?: number;
	defaultValue?: Option | null;
	onChange?: (option: Option | null) => void;
	required?: boolean;
	error?: string;
};

const DEBOUNCE_MS = 250;

export function Autocomplete({
	label,
	name,
	placeholder = "Search...",
	fetchOptions,
	minChars = 0,
	defaultValue = null,
	onChange,
	required = false,
	error,
}: AutocompleteProps) {
	const [value, setValue] = useState<Option | null>(defaultValue);
	const [query, setQuery] = useState(defaultValue?.label ?? "");
	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const [results, setResults] = useState<Option[]>([]);
	const [loading, setLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const rootRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const inputId = useId();
	const errorId = `${inputId}-error`;
	const listboxId = `${inputId}-listbox`;
	const debounceRef = useRef<number | null>(null);
	const requestIdRef = useRef(0);

	const runSearch = useCallback(
		(searchQuery: string) => {
			if (searchQuery.trim().length < minChars) {
				setResults([]);
				setLoading(false);
				return;
			}
			const requestId = requestIdRef.current + 1;
			requestIdRef.current = requestId;
			setLoading(true);
			setFetchError(null);
			fetchOptions(searchQuery)
				.then((data) => {
					if (requestId !== requestIdRef.current) {
						return;
					}
					setResults(data);
				})
				.catch((caughtError: unknown) => {
					if (requestId !== requestIdRef.current) {
						return;
					}
					const messageText =
						caughtError instanceof Error ? caughtError.message : "Something went wrong.";
					setFetchError(messageText);
					setResults([]);
				})
				.finally(() => {
					if (requestId !== requestIdRef.current) {
						return;
					}
					setLoading(false);
				});
		},
		[fetchOptions, minChars],
	);

	useEffect(() => {
		if (!open) {
			return;
		}
		if (debounceRef.current !== null) {
			window.clearTimeout(debounceRef.current);
		}
		debounceRef.current = window.setTimeout(() => {
			runSearch(query);
		}, DEBOUNCE_MS);
		return () => {
			if (debounceRef.current !== null) {
				window.clearTimeout(debounceRef.current);
			}
		};
	}, [query, open, runSearch]);

	useEffect(() => {
		function onClickOutside(event: globalThis.MouseEvent) {
			if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
				setOpen(false);
				setQuery(value?.label ?? "");
			}
		}
		document.addEventListener("mousedown", onClickOutside);
		return () => {
			document.removeEventListener("mousedown", onClickOutside);
		};
	}, [value]);

	useEffect(() => {
		setActiveIndex(0);
	}, []);

	useEffect(() => {
		if (!open) {
			return;
		}
		if (!listRef.current) {
			return;
		}
		const activeElement = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
		if (activeElement) {
			activeElement.scrollIntoView({ block: "nearest" });
		}
	}, [activeIndex, open]);

	function handleFocus() {
		setOpen(true);
		if (results.length === 0 && query.trim().length >= minChars) {
			runSearch(query);
		}
	}

	function commit(option: Option) {
		setValue(option);
		onChange?.(option);
		setQuery(option.label);
		setOpen(false);
	}

	function clear(event: MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		setValue(null);
		onChange?.(null);
		setQuery("");
		setResults([]);
		setOpen(false);
	}

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		setQuery(event.target.value);
		if (!open) {
			setOpen(true);
		}
		if (value) {
			setValue(null);
			onChange?.(null);
		}
	}

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (!open) {
			if (event.key === "ArrowDown" || event.key === "Enter") {
				setOpen(true);
			}
			return;
		}
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setActiveIndex((currentIndex) => Math.min(currentIndex + 1, results.length - 1));
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0));
		} else if (event.key === "Enter") {
			event.preventDefault();
			const activeOption = results[activeIndex];
			if (activeOption) {
				commit(activeOption);
			}
		} else if (event.key === "Escape") {
			setOpen(false);
			setQuery(value?.label ?? "");
		}
	}

	const activeOption = results[activeIndex];
	const activeOptionId = open && activeOption ? `${inputId}-option-${activeIndex}` : undefined;

	return (
		<div className="flex flex-col gap-1.5" ref={rootRef}>
			{name ? <input type="hidden" name={name} value={value?.value ?? ""} /> : null}

			{label ? (
				<label
					htmlFor={inputId}
					className="text-sm font-medium leading-none text-neutral-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					{label}
					{required ? (
						<span className="ml-0.5 text-red-500" aria-hidden="true">
							*
						</span>
					) : null}
				</label>
			) : null}

			<div className="relative">
				<Search
					aria-hidden="true"
					className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
				/>

				<input
					id={inputId}
					role="combobox"
					aria-expanded={open}
					aria-controls={listboxId}
					aria-autocomplete="list"
					aria-activedescendant={activeOptionId}
					aria-required={required}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? errorId : undefined}
					autoComplete="off"
					className={[
						"flex h-9 w-full rounded-md border pl-9 pr-16 py-1 text-sm shadow-sm transition-colors",
						"placeholder:text-neutral-400",
						"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 focus-visible:border-neutral-950",
						"disabled:cursor-not-allowed disabled:opacity-50",
						error ? "border-red-500" : "border-neutral-200",
					].join(" ")}
					placeholder={placeholder}
					value={query}
					onChange={handleChange}
					onFocus={handleFocus}
					onKeyDown={handleKeyDown}
				/>

				<div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
					{loading ? (
						<Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin text-neutral-400" />
					) : value ? (
						<button
							type="button"
							onClick={clear}
							tabIndex={-1}
							className="rounded-sm p-0.5 text-neutral-400 hover:text-neutral-700"
							aria-label="Clear selection"
						>
							<X aria-hidden="true" className="h-3.5 w-3.5" />
						</button>
					) : null}
					<ChevronDown
						aria-hidden="true"
						className={`h-4 w-4 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
					/>
				</div>

				{open ? (
					<ul
						id={listboxId}
						ref={listRef}
						className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border border-neutral-200 p-1 text-sm shadow-md"
					>
						{loading && results.length === 0 ? (
							<li
								role="presentation"
								className="flex items-center justify-center gap-2 px-2 py-4 text-neutral-400"
							>
								<Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
								Searching...
							</li>
						) : fetchError ? (
							<li role="presentation" className="px-2 py-4 text-center text-red-500">
								{fetchError}
							</li>
						) : query.trim().length < minChars ? (
							<li role="presentation" className="px-2 py-4 text-center text-neutral-400">
								{`Type ${minChars - query.trim().length} more character${
									minChars - query.trim().length === 1 ? "" : "s"
								}...`}
							</li>
						) : results.length === 0 ? (
							<li role="presentation" className="px-2 py-4 text-center text-neutral-400">
								No results found.
							</li>
						) : (
							results.map((option, index) => {
								const selected = value?.value === option.value;
								const active = index === activeIndex;
								return (
									<li
										key={option.value}
										id={`${inputId}-option-${index}`}
										data-index={index}
										onMouseEnter={() => setActiveIndex(index)}
										onMouseDown={(event) => {
											event.preventDefault();
											commit(option);
										}}
										className={[
											"relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 outline-none",
											active ? "bg-neutral-100" : "",
										].join(" ")}
									>
										<span className={selected ? "font-medium" : ""}>{option.label}</span>
										{option.sublabel ? (
											<span className="ml-1.5 text-xs text-neutral-400">{option.sublabel}</span>
										) : null}
										{selected ? (
											<Check aria-hidden="true" className="ml-auto h-4 w-4 text-neutral-900" />
										) : null}
									</li>
								);
							})
						)}
					</ul>
				) : null}
			</div>

			{error ? (
				<p id={errorId} role="alert" className="text-xs font-medium text-red-500">
					{error}
				</p>
			) : null}
		</div>
	);
}
