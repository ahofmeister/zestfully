"use client";
import { PencilIcon } from "lucide-react";
import {
	type ChangeEvent,
	useActionState,
	useEffect,
	useRef,
	useState,
} from "react";
import { renameHabit } from "@/components/habit/habit-actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { habitSchema } from "@/drizzle/schema";
import { cn } from "@/lib/utils";

const PREDEFINED_COLORS = [
	{ name: "Emerald", value: "#10b981" },
	{ name: "Blue", value: "#3b82f6" },
	{ name: "Purple", value: "#a855f7" },
	{ name: "Pink", value: "#ec4899" },
	{ name: "Orange", value: "#f97316" },
	{ name: "Yellow", value: "#eab308" },
	{ name: "Red", value: "#ef4444" },
	{ name: "Gray", value: "#6b7280" },
];

export default function EditHabit(props: {
	habit: typeof habitSchema.$inferSelect;
}) {
	const [open, setOpen] = useState(false);
	const [state, formAction, isPending] = useActionState(renameHabit, null);
	const formRef = useRef<HTMLFormElement>(null);
	const [selectedColor, setSelectedColor] = useState(props.habit.color);
	const [customColor, setCustomColor] = useState("");

	useEffect(() => {
		if (state?.success) {
			setOpen(false);
			formRef.current?.reset();
		}
	}, [state]);

	const handleColorSelect = (color: string) => {
		setSelectedColor(color);
		setCustomColor("");
	};

	const handleCustomColorChange = (e: ChangeEvent<HTMLInputElement>) => {
		const color = e.target.value;
		setCustomColor(color);
		setSelectedColor(color);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"ghost"} size={"iconSm"}>
					<PencilIcon size={12} />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form ref={formRef} action={formAction}>
					<DialogHeader>
						<DialogTitle>Edit Habit</DialogTitle>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<input type="hidden" name="habitId" value={props.habit.id} />
						<input type="hidden" name="color" value={selectedColor} />

						<div className="grid gap-2">
							<Label htmlFor="name">Habit Name</Label>
							<Input
								id="name"
								name="name"
								defaultValue={props.habit.name}
								placeholder="Enter habit name"
								required
								disabled={isPending}
							/>
						</div>

						<div className="grid gap-2">
							<Label>Color</Label>
							<div className="grid grid-flow-col grid-rows-1 gap-2">
								{PREDEFINED_COLORS.map((color) => (
									<button
										key={color.value}
										type="button"
										onClick={() => handleColorSelect(color.value)}
										className={cn(
											"h-8 w-8 rounded-md transition-all hover:scale-105",
											selectedColor === color.value &&
												"ring-2 ring-offset-2 ring-primary",
										)}
										style={{ backgroundColor: color.value }}
										aria-label={color.name}
										disabled={isPending}
									/>
								))}
							</div>

							<div className="flex items-center gap-2 mt-2">
								<Label htmlFor="customColor" className="text-xs">
									Custom:
								</Label>
								<input
									id="customColor"
									type="color"
									value={customColor || selectedColor}
									onChange={handleCustomColorChange}
									disabled={isPending}
									className="h-8 w-8 rounded border cursor-pointer"
								/>
							</div>
						</div>

						{state?.error && (
							<p className="text-sm text-destructive">{state.error}</p>
						)}
					</div>

					<DialogFooter className="gap-2">
						<DialogClose asChild>
							<Button
								type="button"
								variant="secondary"
								size="sm"
								disabled={isPending}
							>
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" size="sm" disabled={isPending}>
							{isPending ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

339 + 798;
