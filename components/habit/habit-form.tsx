"use client";
import { type ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export default function HabitForm({
	defaultName = "",
	defaultColor = "#3b82f6",
	isPending = false,
}: {
	defaultName?: string;
	defaultColor?: string;
	isPending?: boolean;
}) {
	const [selectedColor, setSelectedColor] = useState(defaultColor);
	const [customColor, setCustomColor] = useState("");

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
		<div className="grid gap-4">
			<input type="hidden" name="color" value={selectedColor} />

			<div className="grid gap-2">
				<Label htmlFor="name">Habit Name</Label>
				<Input
					id="name"
					name="name"
					defaultValue={defaultName}
					placeholder="e.g., Morning Run, Read 30 min"
					required
					disabled={isPending}
					autoFocus
				/>
			</div>

			<div className="grid gap-2">
				<Label>Color</Label>
				<RadioGroup
					value={selectedColor}
					onValueChange={handleColorSelect}
					className="grid grid-cols-8 gap-2"
					disabled={isPending}
				>
					{PREDEFINED_COLORS.map((color) => (
						<div key={color.value} className="relative">
							<RadioGroupItem
								value={color.value}
								id={color.value}
								className="peer sr-only"
								disabled={isPending}
							/>
							<Label
								htmlFor={color.value}
								className={cn(
									"flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-all hover:scale-105",
									"peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-offset-2 peer-data-[state=checked]:ring-primary",
								)}
								style={{ backgroundColor: color.value }}
							>
								<span className="sr-only">{color.name}</span>
							</Label>
						</div>
					))}
				</RadioGroup>

				<div className="flex items-center gap-2">
					<Label htmlFor="customColor" className="text-sm">
						Custom:
					</Label>
					<Input
						id="customColor"
						type="color"
						value={customColor || selectedColor}
						onChange={handleCustomColorChange}
						disabled={isPending}
						className="h-10 w-20 cursor-pointer"
					/>
				</div>
			</div>
		</div>
	);
}
