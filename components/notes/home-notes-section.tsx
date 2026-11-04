"use client";

import { Plus } from "lucide-react";
import { type ReactNode, useState } from "react";
import { NoteEditor } from "@/components/notes/note-editor";
import { Button } from "@/components/ui/button";

export function NotesSection({ date, children }: { date: Date; children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex flex-col gap-6">
			<header className="flex items-center justify-between gap-4">
				<h2 className="text-2xl font-semibold tracking-tight">Notes</h2>
				{isOpen ? null : (
					<Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
						<Plus size={14} />
						Add note
					</Button>
				)}
			</header>
			<div className="flex flex-col gap-4">
				{isOpen ? (
					<NoteEditor
						onCloseAction={() => setIsOpen(false)}
						note={{
							date,
							text: "",
						}}
					/>
				) : null}
				{children}
			</div>
		</div>
	);
}
