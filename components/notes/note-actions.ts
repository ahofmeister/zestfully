"use server";

import { formatDate } from "date-fns";
import { eq } from "drizzle-orm";
import { dbTransaction } from "@/drizzle/client";
import { noteSchema } from "@/drizzle/schema";
import { DB_DATE_FORMAT } from "@/utils/utils";

export async function saveNote({
	id,
	text,
	date,
}: {
	id?: string;
	text: string;
	date: Date;
}): Promise<{ id?: string; error?: string }> {
	const trimmed = text.trim();

	if (!trimmed) {
		return { error: "Note can't be empty." };
	}

	const [note] = await dbTransaction((tx) =>
		tx
			.insert(noteSchema)
			.values({ id, text: trimmed, date: formatDate(date, DB_DATE_FORMAT) })
			.onConflictDoUpdate({ target: noteSchema.id, set: { text: trimmed } })
			.returning({ id: noteSchema.id }),
	);

	return { id: note.id };
}

export async function deleteNote({ id }: { id: string }): Promise<void> {
	await dbTransaction((tx) => tx.delete(noteSchema).where(eq(noteSchema.id, id)));
}
