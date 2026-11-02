import { format } from "date-fns";
import { desc, eq } from "drizzle-orm";
import { NoteCard } from "@/components/notes/note-card";
import { dbTransaction } from "@/drizzle/client";
import { noteSchema } from "@/drizzle/schema";

export async function NotesList({ date }: { date: Date }) {
	const day = format(date, "yyyy-MM-dd");

	const notes = await dbTransaction((tx) =>
		tx
			.select()
			.from(noteSchema)
			.where(eq(noteSchema.date, day))
			.orderBy(desc(noteSchema.createdAt)),
	);

	return (
		<>
			{notes.map((note) => (
				<NoteCard key={note.id} note={note} />
			))}
		</>
	);
}
