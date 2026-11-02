"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { saveNote } from "@/components/notes/note-actions";
import { Textarea } from "@/components/ui/textarea";

const SAVE_DELAY_MS = 500;

type NoteEditorProps = {
	date: Date;
	note?: { id: string; text: string | null };
	onCloseAction: () => void;
};

export function NoteEditor({ date, note, onCloseAction }: NoteEditorProps) {
	const router = useRouter();
	const [text, setText] = useState(note?.text ?? "");
	const [error, setError] = useState<string>();
	const idRef = useRef(note?.id);
	const lastSavedRef = useRef(note?.text ?? "");
	const queueRef = useRef<Promise<unknown>>(Promise.resolve());
	const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		return () => clearTimeout(timerRef.current);
	}, []);

	const persist = async (value: string): Promise<boolean> => {
		const trimmed = value.trim();

		if (!trimmed || trimmed === lastSavedRef.current) {
			return true;
		}

		const result = await saveNote({ id: idRef.current, text: trimmed, date });

		if (result.error) {
			setError(result.error);
			return false;
		}

		idRef.current = result.id;
		lastSavedRef.current = trimmed;
		setError(undefined);
		return true;
	};

	const save = (value: string): Promise<boolean> => {
		const task = queueRef.current.then(() => persist(value));
		queueRef.current = task.catch(() => undefined);
		return task;
	};

	const handleChange = (value: string) => {
		setText(value);
		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => save(value), SAVE_DELAY_MS);
	};

	const handleBlur = async () => {
		clearTimeout(timerRef.current);

		if (await save(text)) {
			onCloseAction();
			router.refresh();
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<Textarea
				autoFocus
				value={text}
				placeholder="Write a note…"
				onChange={(event) => handleChange(event.target.value)}
				onBlur={handleBlur}
			/>
			{error ? <p className="text-sm text-destructive">{error}</p> : null}
		</div>
	);
}
