"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteNote } from "@/components/notes/note-actions";
import { NoteEditor } from "@/components/notes/note-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NoteCardProps = {
	note: { id: string; text: string | null; date: Date };
};

export function NoteCard({ note }: NoteCardProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		startTransition(async () => {
			await deleteNote({ id: note.id });
			router.refresh();
		});
	};

	if (isEditing) {
		return <NoteEditor date={note.date} note={note} onCloseAction={() => setIsEditing(false)} />;
	}

	return (
		<Card className={cn("group gap-0 py-3", isPending && "opacity-50")}>
			<CardContent className="flex items-start gap-2">
				<button
					type="button"
					className="flex-1 cursor-text whitespace-pre-wrap text-left text-sm"
					onClick={() => setIsEditing(true)}
				>
					{note.text}
				</button>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Delete note"
					disabled={isPending}
					onClick={handleDelete}
					className="size-6 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
				>
					<Trash2 className="size-3.5" />
				</Button>
			</CardContent>
		</Card>
	);
}
