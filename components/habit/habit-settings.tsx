"use client";
import { Settings, Trash2 } from "lucide-react";
import {
	type ChangeEvent,
	useActionState,
	useEffect,
	useRef,
	useState,
} from "react";
import { deleteHabit, updateHabit } from "@/components/habit/habit-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	FREQUENCY_TYPES,
	type FrequencyType,
	type habitSchema,
	VISIBILITY_TYPES,
	WEEKDAYS,
	type Weekday,
} from "@/drizzle/schema";
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

export default function HabitSettings({
	habit,
}: {
	habit: typeof habitSchema.$inferSelect;
}) {
	const [open, setOpen] = useState(false);
	const [state, formAction, isPending] = useActionState(updateHabit, {
		error: undefined,
		success: false,
	});
	const formRef = useRef<HTMLFormElement>(null);

	const [selectedColor, setSelectedColor] = useState(habit.color);
	const [customColor, setCustomColor] = useState("");

	const [frequencyType, setFrequencyType] = useState<FrequencyType>(
		habit.frequencyType,
	);
	const [frequencyTarget, setFrequencyTarget] = useState<number>(
		habit.frequencyTarget || 1,
	);
	const [frequencyDays, setFrequencyDays] = useState<Weekday[]>(
		habit.frequencyDays || [],
	);

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

	const toggleDay = (day: Weekday) => {
		setFrequencyDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
		);
	};

	const incrementTarget = () =>
		setFrequencyTarget((prev) => Math.min(7, prev + 1));
	const decrementTarget = () =>
		setFrequencyTarget((prev) => Math.max(1, prev - 1));

	const handleDelete = async () => {
		if (!confirm(`Delete "${habit.name}"? This cannot be undone.`)) {
			return;
		}
		await deleteHabit(habit.id);
		setOpen(false);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="iconSm">
					<Settings className="size-3.5" />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<form ref={formRef} action={formAction}>
					<SheetHeader>
						<SheetTitle>Habit Settings</SheetTitle>
						<SheetDescription>
							Customize your habit tracking preferences
						</SheetDescription>
					</SheetHeader>

					<div className="grid gap-4 py-4">
						<input type="hidden" name="habitId" value={habit.id} />
						<input type="hidden" name="color" value={selectedColor} />
						<input type="hidden" name="frequencyType" value={frequencyType} />
						{frequencyType === "per_week" && (
							<input
								type="hidden"
								name="frequencyTarget"
								value={frequencyTarget}
							/>
						)}
						{frequencyType === "scheduled_days" &&
							frequencyDays.map((day) => (
								<input
									key={day}
									type="hidden"
									name="frequencyDays"
									value={day}
								/>
							))}

						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								name="name"
								defaultValue={habit.name}
								placeholder="Habit name"
								required
								disabled={isPending}
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
											id={`settings-${color.value}`}
											className="peer sr-only"
											disabled={isPending}
										/>
										<Label
											htmlFor={`settings-${color.value}`}
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

						<div className="grid gap-2">
							<Label htmlFor="visibility">Visibility</Label>
							<Select name="visibility" defaultValue={habit.visibility}>
								<SelectTrigger disabled={isPending}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{VISIBILITY_TYPES.map((type) => (
										<SelectItem key={type} value={type}>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label>Frequency</Label>
							<div className="flex gap-2">
								{FREQUENCY_TYPES.map((type) => (
									<Button
										key={type}
										type="button"
										variant={frequencyType === type ? "default" : "outline"}
										className="flex-1 text-xs"
										onClick={() => {
											setFrequencyType(type as FrequencyType);
											if (type === "per_week") {
												setFrequencyTarget(1);
											}
											if (type === "scheduled_days") {
												setFrequencyDays([]);
											}
										}}
										disabled={isPending}
									>
										{type === "daily"
											? "Daily"
											: type === "per_week"
												? "X / week"
												: "Scheduled Days"}
									</Button>
								))}
							</div>
						</div>

						{frequencyType === "per_week" && (
							<div className="flex items-center justify-center gap-4 py-4">
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={decrementTarget}
									disabled={isPending || frequencyTarget <= 1}
									className="h-10 w-10 shrink-0"
								>
									<span className="text-lg font-semibold">−</span>
								</Button>
								<div className="text-center min-w-[120px]">
									<div className="text-2xl font-bold tabular-nums">
										{frequencyTarget}
									</div>
									<div className="text-xs text-muted-foreground mt-1">
										{frequencyTarget === 1 ? "time per week" : "times per week"}
									</div>
								</div>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={incrementTarget}
									disabled={isPending || frequencyTarget >= 7}
									className="h-10 w-10 shrink-0"
								>
									<span className="text-lg font-semibold">+</span>
								</Button>
							</div>
						)}

						{frequencyType === "scheduled_days" && (
							<div className="space-y-3 py-2">
								<p className="text-sm text-muted-foreground text-center">
									Select the days you want to perform this habit
								</p>
								<ToggleGroup
									type="multiple"
									variant="outline"
									defaultValue={frequencyDays}
								>
									{WEEKDAYS.map((day) => (
										<ToggleGroupItem
											onClick={() => toggleDay(day as Weekday)}
											className="uppercase text-xs"
											disabled={isPending}
											key={day}
											value={day}
										>
											{day.slice(0, 3)}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
								{frequencyDays.length > 0 && (
									<p className="text-xs text-center text-muted-foreground">
										{frequencyDays.length}{" "}
										{frequencyDays.length === 1 ? "day" : "days"} selected
									</p>
								)}
							</div>
						)}

						{state?.error && (
							<p className="text-sm text-destructive">{state.error}</p>
						)}
					</div>

					<SheetFooter className="flex-col gap-2 sm:flex-col">
						<Button type="submit" disabled={isPending} className="w-full">
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={handleDelete}
							disabled={isPending}
							className="w-full gap-2"
						>
							<Trash2 className="h-4 w-4" />
							Delete Habit
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
