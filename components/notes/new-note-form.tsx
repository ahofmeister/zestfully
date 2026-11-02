"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { NoteEditor } from "@/components/notes/note-editor";
import { Button } from "@/components/ui/button";

export function NewNoteForm({ date }: { date: Date }) {
	const [isOpen, setIsOpen] = useState(false);

	if (!isOpen) {
		return (
			<Button variant="outline" size="sm" className="self-end" onClick={() => setIsOpen(true)}>
				<Plus />
				Add note
			</Button>
		);
	}

	return <NoteEditor date={date} onCloseAction={() => setIsOpen(false)} />;
}
