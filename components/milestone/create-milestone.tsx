"use client";

import * as React from "react";

import { createMilestone } from "@/components/milestone/milestone-actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

const initialState = {
	error: undefined as string | undefined,
	success: false,
};

export default function CreateMilestone() {
	const [state, formAction, isPending] = React.useActionState(
		createMilestone,
		initialState,
	);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Create Milestone</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Milestone</DialogTitle>
				</DialogHeader>

				<form
					action={formAction}
					className="space-y-4"
					onSubmit={(e) => {
						const form = e.currentTarget;
						const calendar = form.querySelector(
							"calendar-element", // placeholder: custom Calendar element wrapper
						) as any;

						const input = form.querySelector<HTMLInputElement>(
							'input[name="dueDate"]',
						);
						if (!input) return;

						if (calendar?.value) {
							input.value = calendar.value; // set ISO string
						}
					}}
				>
					{/* Milestone name */}
					<Input
						type="text"
						name="name"
						placeholder="Milestone name"
						required
						disabled={isPending}
					/>

					<Input type="hidden" name="dueDate" required />

					<Popover>
						<PopoverTrigger asChild>
							<Button type="button" variant="outline" className="w-full">
								Pick a date
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								weekStartsOn={1}
								initialFocus
								onSelect={(date) => {
									const form = document.activeElement?.closest("form");
									if (!form || !date) return;
									const input = form.querySelector<HTMLInputElement>(
										'input[name="dueDate"]',
									);

									if (!input) {
										return;
									}
									input.value = date.toISOString();
								}}
							/>
						</PopoverContent>
					</Popover>

					{state.error && (
						<p className="text-sm text-destructive">{state.error}</p>
					)}

					<Button type="submit" disabled={isPending}>
						{isPending ? "Creating…" : "Create milestone"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
