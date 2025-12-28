"use client";
import { format } from "date-fns";
import { CalendarIcon, Globe, Lock, Users, XIcon } from "lucide-react";
import {
	type ChangeEvent,
	useActionState,
	useEffect,
	useRef,
	useState,
} from "react";
import { PREDEFINED_COLORS } from "@/components/colors";
import { createMilestone } from "@/components/milestone/milestone-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { milestones } from "@/drizzle/schema";
import { cn } from "@/lib/utils";

const DEFAULT_CELEBRATIONS = [
	{ days: 1, label: "1 Day" },
	{ days: 7, label: "1 Week" },
	{ days: 30, label: "1 Month" },
	{ days: 100, label: "100 Days" },
	{ days: 365, label: "1 Year" },
];

type Milestone = typeof milestones.$inferSelect;

const VISIBILITY_CONFIG = [
	{
		value: "public" as const,
		icon: Globe,
		label: "Public",
		description: "Everyone can see",
	},
	{
		value: "members" as const,
		icon: Users,
		label: "Members only",
		description: "Logged-in users",
	},
	{
		value: "private" as const,
		icon: Lock,
		label: "Private",
		description: "Only you",
	},
] as const;

export default function MilestoneDialog({
	milestone,
	children,
}: {
	milestone?: Milestone;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const isEditMode = !!milestone;

	const [state, formAction, isPending] = useActionState(createMilestone, {
		success: false,
		error: undefined,
	});
	const formRef = useRef<HTMLFormElement>(null);

	const [selectedColor, setSelectedColor] = useState(
		milestone?.color || "#10b981",
	);
	const [customColor, setCustomColor] = useState("");
	const [celebrations, setCelebrations] = useState<number[]>(
		milestone?.celebrations || [7, 30, 100, 365],
	);
	const [customCelebration, setCustomCelebration] = useState("");

	const [startDate, setStartDate] = useState<Date | undefined>(
		milestone?.startDate ? new Date(milestone.startDate) : new Date(),
	);

	useEffect(() => {
		if (state?.success) {
			setOpen(false);
			formRef.current?.reset();
			if (!isEditMode) {
				setSelectedColor("#10b981");
				setCelebrations([7, 30, 100, 365]);
				setCustomColor("");
			}
		}
	}, [state, isEditMode]);

	const handleColorSelect = (color: string) => {
		setSelectedColor(color);
		setCustomColor("");
	};

	const handleCustomColorChange = (e: ChangeEvent<HTMLInputElement>) => {
		const color = e.target.value;
		setCustomColor(color);
		setSelectedColor(color);
	};

	const addCustomCelebration = () => {
		const days = parseInt(customCelebration, 10);
		if (days && days > 0 && !celebrations.includes(days)) {
			setCelebrations([...celebrations, days].sort((a, b) => a - b));
			setCustomCelebration("");
		}
	};

	const removeCelebration = (days: number) => {
		if (celebrations.length > 1) {
			setCelebrations(celebrations.filter((d) => d !== days));
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<form ref={formRef} action={formAction}>
					<DialogHeader>
						<DialogTitle>
							{isEditMode ? "Edit Milestone" : "Create New Milestone"}
						</DialogTitle>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<input type="hidden" name="color" value={selectedColor} />
						<input
							type="hidden"
							name="celebrations"
							value={JSON.stringify(celebrations)}
						/>
						{isEditMode && (
							<input type="hidden" name="milestoneId" value={milestone.id} />
						)}

						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								name="name"
								placeholder="e.g., I quit smoking, I've been vegan"
								defaultValue={milestone?.name}
								required
								disabled={isPending}
								autoFocus={!isEditMode}
							/>
						</div>

						<div className="grid gap-2">
							<p className="text-xs text-muted-foreground">
								Add context or why this milestone matters to you...
							</p>
							<Textarea
								id="description"
								name="description"
								defaultValue={milestone?.description || ""}
								disabled={isPending}
								rows={3}
							/>
						</div>

						{!isEditMode && (
							<div className="grid gap-2">
								<p className="text-xs text-muted-foreground">
									When did you start or quit?
								</p>{" "}
								<input
									type="hidden"
									name="startDate"
									value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
								/>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												"justify-start text-left font-normal",
												!startDate && "text-muted-foreground",
											)}
											disabled={isPending}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{startDate ? format(startDate, "PPP") : "Pick a date"}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={startDate}
											onSelect={setStartDate}
											disabled={(date) => date > new Date()}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
						)}

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

						<div className="grid gap-2">
							<Label htmlFor="visibility">Visibility</Label>
							<Select
								name="visibility"
								defaultValue={milestone?.visibility || "private"}
							>
								<SelectTrigger disabled={isPending}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{VISIBILITY_CONFIG.map((visibility) => (
										<SelectItem key={visibility.value} value={visibility.value}>
											{visibility.description}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className="text-xs text-muted-foreground">
								Who can see this milestone?
							</p>
						</div>

						<div className="grid gap-2">
							<Label>Celebration Milestones</Label>
							<p className="text-xs text-muted-foreground">
								Days to celebrate when reached
							</p>
							<div className="flex flex-wrap gap-2">
								{celebrations.map((days) => {
									const defaultCelebration = DEFAULT_CELEBRATIONS.find(
										(c) => c.days === days,
									);
									return (
										<Badge
											key={days}
											variant="secondary"
											className="flex items-center gap-1 px-3 py-1 cursor-pointer"
											onClick={() => removeCelebration(days)}
										>
											<span>{defaultCelebration?.label || `${days} days`}</span>
											<XIcon className="h-3 w-3" />
										</Badge>
									);
								})}
							</div>
							<div className="flex gap-2">
								<Input
									type="number"
									placeholder="Custom days"
									value={customCelebration}
									onChange={(e) => setCustomCelebration(e.target.value)}
									disabled={isPending}
									className="flex-1"
									min="1"
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addCustomCelebration}
									disabled={isPending}
								>
									Add
								</Button>
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
							{isPending
								? isEditMode
									? "Saving..."
									: "Creating..."
								: isEditMode
									? "Save"
									: "Create Milestone"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
