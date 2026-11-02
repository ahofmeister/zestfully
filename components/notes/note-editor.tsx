"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveNote } from "@/components/notes/note-actions";
import { Textarea } from "@/components/ui/textarea";
import type { noteSchema } from "@/drizzle/schema";

type NoteEditorProps = {
	note: typeof noteSchema.$inferSelect | typeof noteSchema.$inferInsert;
	onCloseAction: () => void;
};

export function NoteEditor({ note, onCloseAction }: NoteEditorProps) {
	const router = useRouter();
	const [text, setText] = useState(note.text);
	const [error, setError] = useState<string>();

	const handleBlur = async () => {
		const trimmed = text.trim();

		if (!trimmed || trimmed === note.text) {
			onCloseAction();
			return;
		}

		const result = await saveNote({ ...note, text: trimmed });

		if (result.error) {
			setError(result.error);
			return;
		}

		onCloseAction();
		router.refresh();
	};

	return (
		<div className="flex flex-col gap-2">
			<Textarea
				autoFocus
				value={text}
				placeholder="Write a note…"
				onChange={(event) => setText(event.target.value)}
				onBlur={handleBlur}
			/>
			{error ? <p className="text-sm text-destructive">{error}</p> : null}
		</div>
	);
}
