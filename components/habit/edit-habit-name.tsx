"use client";
import { PencilIcon } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
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

export default function EditHabitName(props: {
	habit: typeof habitSchema.$inferSelect;
}) {
	const [open, setOpen] = useState(false);
	const [state, formAction, isPending] = useActionState(renameHabit, null);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state?.success) {
			setOpen(false);
			formRef.current?.reset();
		}
	}, [state]);

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
						<DialogTitle>Rename Habit</DialogTitle>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<input type="hidden" name="habitId" value={props.habit.id} />
						<div className="grid gap-2">
							<Label htmlFor="name">Habit Name</Label>
							<Input
								id="name"
								name="name"
								defaultValue={props.habit.name}
								placeholder="Enter new habit name"
								required
								disabled={isPending}
							/>
							{state?.error && (
								<p className="text-sm text-destructive">{state.error}</p>
							)}
						</div>
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
