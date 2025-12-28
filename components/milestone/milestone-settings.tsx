"use client";
import { format } from "date-fns";
import { CalendarIcon, Globe, Lock, Trash2, Users, XIcon } from "lucide-react";
import {
	type ChangeEvent,
	useActionState,
	useEffect,
	useRef,
	useState,
} from "react";
import { PREDEFINED_COLORS } from "@/components/colors";
import {
	deleteMilestone,
	saveMilestone,
} from "@/components/milestone/milestone-actions";
import {
	type Celebration,
	formatCelebration,
	sortCelebrations,
} from "@/components/milestone/milestone-celebration-calculator";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { milestones } from "@/drizzle/schema";
import { cn } from "@/lib/utils";

type CelebrationUnit = "days" | "weeks" | "months" | "years";

const DEFAULT_CELEBRATIONS: Celebration[] = [
	{ value: 1, unit: "days" },
	{ value: 1, unit: "weeks" },
	{ value: 1, unit: "months" },
	{ value: 100, unit: "days" },
	{ value: 1, unit: "years" },
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

export default function MilestoneSettings({
	milestone,
	children,
}: {
	milestone?: Milestone;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const isEditMode = !!milestone;

	const [state, formAction, isPending] = useActionState(saveMilestone, {
		success: false,
		error: undefined,
	});
	const formRef = useRef<HTMLFormElement>(null);

	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const [selectedColor, setSelectedColor] = useState(
		milestone?.color || "#10b981",
	);
	const [customColor, setCustomColor] = useState("");
	const [celebrations, setCelebrations] = useState<Celebration[]>(
		(milestone?.celebrations as Celebration[]) || DEFAULT_CELEBRATIONS,
	);
	const [customValue, setCustomValue] = useState("");
	const [customUnit, setCustomUnit] = useState<CelebrationUnit>("days");

	const [startDate, setStartDate] = useState<Date | undefined>(
		milestone?.startDate ? new Date(milestone.startDate) : new Date(),
	);

	useEffect(() => {
		if (state?.success) {
			setOpen(false);
			formRef.current?.reset();
			if (!isEditMode) {
				setSelectedColor("#10b981");
				setCelebrations(DEFAULT_CELEBRATIONS);
				setCustomColor("");
				setCustomValue("");
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
		const value = parseInt(customValue, 10);
		if (value && value > 0) {
			const newCelebration = { value, unit: customUnit };
			// Check if this exact celebration already exists
			const exists = celebrations.some(
				(c) => c.value === value && c.unit === customUnit,
			);
			if (!exists) {
				setCelebrations(sortCelebrations([...celebrations, newCelebration]));
				setCustomValue("");
			}
		}
	};

	const removeCelebration = (index: number) => {
		setCelebrations(celebrations.filter((_, i) => i !== index));
	};

	const handleDelete = async () => {
		if (!milestone?.id) return;

		setIsDeleting(true);
		const result = await deleteMilestone(milestone.id);
		setIsDeleting(false);

		if (result.success) {
			setShowDeleteDialog(false);
			setOpen(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent>
				<form
					ref={formRef}
					action={formAction}
					className="mx-auto w-full max-w-md"
				>
					<SheetHeader>
						<SheetTitle>
							{isEditMode ? "Edit Milestone" : "Create New Milestone"}
						</SheetTitle>
					</SheetHeader>

					<div className="overflow-y-auto px-4 pb-4">
						<div className="grid gap-4">
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
								<Label htmlFor="description">Description (optional)</Label>
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
									<Label>Start Date</Label>
									<p className="text-xs text-muted-foreground">
										When did you start or quit?
									</p>
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
											<SelectItem
												key={visibility.value}
												value={visibility.value}
											>
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
								<Label>Celebration Milestones (optional)</Label>
								<p className="text-xs text-muted-foreground">
									Get notified when you reach these milestones
								</p>
								{celebrations.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{sortCelebrations(celebrations).map(
											(celebration, index) => {
												const originalIndex = celebrations.findIndex(
													(c) =>
														c.value === celebration.value &&
														c.unit === celebration.unit,
												);
												return (
													<Badge
														key={index}
														variant="secondary"
														className="flex items-center gap-1 px-3 py-1 cursor-pointer hover:bg-destructive/10"
														onClick={() => removeCelebration(originalIndex)}
													>
														<span>{formatCelebration(celebration)}</span>
														<XIcon className="h-3 w-3" />
													</Badge>
												);
											},
										)}
									</div>
								)}
								<div className="flex gap-2">
									<Input
										type="number"
										placeholder="e.g., 5"
										value={customValue}
										onChange={(e) => setCustomValue(e.target.value)}
										disabled={isPending}
										className="flex-1"
										min="1"
									/>
									<Select
										value={customUnit}
										onValueChange={(value) =>
											setCustomUnit(value as CelebrationUnit)
										}
										disabled={isPending}
									>
										<SelectTrigger className="w-[110px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="days">Days</SelectItem>
											<SelectItem value="weeks">Weeks</SelectItem>
											<SelectItem value="months">Months</SelectItem>
											<SelectItem value="years">Years</SelectItem>
										</SelectContent>
									</Select>
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
					</div>

					<SheetFooter>
						<AlertDialog
							open={showDeleteDialog}
							onOpenChange={setShowDeleteDialog}
						>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete Milestone?</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to delete "{milestone?.name}"? This
										action cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel disabled={isDeleting}>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleDelete}
										disabled={isDeleting}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										{isDeleting ? "Deleting..." : "Delete"}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						<div className={"flex gap-x-2"}>
							<Button type="submit" disabled={isPending}>
								{isPending
									? isEditMode
										? "Saving..."
										: "Creating..."
									: isEditMode
										? "Save Changes"
										: "Create Milestone"}
							</Button>
							<SheetClose asChild>
								<Button variant="outline" disabled={isPending}>
									Cancel
								</Button>
							</SheetClose>
						</div>
						{isEditMode && (
							<Button
								type="button"
								variant="destructive"
								disabled={isPending}
								onClick={() => setShowDeleteDialog(true)}
								className="mt-2"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Delete Milestone
							</Button>
						)}
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
