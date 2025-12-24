"use client";
import { PlusIcon } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { createHabit } from "@/components/habit/habit-actions";
import HabitForm from "@/components/habit/habit-form";
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

export default function CreateHabit() {
	const [open, setOpen] = useState(false);
	const [state, formAction, isPending] = useActionState(createHabit, {
		error: undefined,
		success: false,
	});
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
				<Button variant="default" size="sm" className="gap-1.5">
					<PlusIcon className="h-4 w-4" />
					New Habit
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form ref={formRef} action={formAction}>
					<DialogHeader>
						<DialogTitle>Create New Habit</DialogTitle>
					</DialogHeader>

					<div className="py-4">
						<HabitForm isPending={isPending} />

						{state?.error && (
							<p className="text-sm text-destructive mt-4">{state.error}</p>
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
							{isPending ? "Creating..." : "Create Habit"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
