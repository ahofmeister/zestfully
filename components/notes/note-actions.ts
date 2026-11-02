"use server";

import { eq } from "drizzle-orm";
import { dbTransaction } from "@/drizzle/client";
import { noteSchema } from "@/drizzle/schema";

export async function saveNote(
	note: typeof noteSchema.$inferInsert,
): Promise<{ id?: string; error?: string }> {
	const trimmed = note.text.trim();

	if (!trimmed) {
		return { error: "Note can't be empty." };
	}

	const [saved] = await dbTransaction((tx) =>
		tx
			.insert(noteSchema)
			.values({ ...note, text: trimmed })
			.onConflictDoUpdate({ target: noteSchema.id, set: { text: trimmed } })
			.returning(),
	);

	return { id: saved.id };
}

export async function deleteNote({ id }: { id: string }): Promise<void> {
	await dbTransaction((tx) => tx.delete(noteSchema).where(eq(noteSchema.id, id)));
}
