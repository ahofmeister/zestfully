"use client";

import { Minus, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { updateMealItemQuantity } from "@/components/meal-item/meal-item-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MealItemQuantityControl({
	id,
	quantity,
	unit,
}: {
	id: string;
	quantity: number;
	unit: string | null;
}) {
	const [value, setValue] = useState(String(quantity));
	const [isPending, startTransition] = useTransition();

	const commit = (nextValue: number) => {
		const next = Math.max(0, Math.round(nextValue * 10) / 10);
		setValue(String(next));
		if (next === quantity) return;
		startTransition(() => updateMealItemQuantity(id, next));
	};

	return (
		<div className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5 shadow-sm">
			<Button
				aria-label={`Decrease quantity${unit ? ` in ${unit}` : ""}`}
				className="size-7 rounded-md"
				disabled={isPending || Number(value) <= 0}
				onClick={() => commit(Number(value) - 10)}
				size="iconSm"
				variant="ghost"
			>
				<Minus data-icon="inline-start" />
			</Button>
			<Input
				aria-label="Quantity"
				className="h-7 w-14 border-0 bg-transparent p-0 text-center font-mono text-xs tabular-nums shadow-none focus-visible:ring-0"
				disabled={isPending}
				inputMode="decimal"
				onBlur={() => commit(Number(value) || 0)}
				onChange={(event) => setValue(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) {
						commit(Number(value) || 0);
						event.currentTarget.blur();
					}
				}}
				value={value}
			/>
			<Button
				aria-label={`Increase quantity${unit ? ` in ${unit}` : ""}`}
				className="size-7 rounded-md"
				disabled={isPending}
				onClick={() => commit(Number(value) + 10)}
				size="iconSm"
				variant="ghost"
			>
				<Plus data-icon="inline-start" />
			</Button>
		</div>
	);
}
