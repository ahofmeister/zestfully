import { eq } from "drizzle-orm";
import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { dbTransaction } from "@/drizzle/client";
import { profileSchema } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";

export default async function AuthButton() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	let profile = null;
	if (user) {
		profile = await dbTransaction(async (tx) => {
			return tx.query.profileSchema.findFirst({
				where: eq(profileSchema.userId, user.id),
			});
		});
	}

	return user ? (
		<div className="flex items-center gap-4">
			{profile && (
				<Link href={`/${profile.username}`} className="text-sm hover:underline">
					@{profile.username}
				</Link>
			)}
			<form action={signOutAction}>
				<Button type="submit" variant="outline" size="sm">
					Sign out
				</Button>
			</form>
		</div>
	) : (
		<div className="flex gap-2">
			<Button asChild size="sm" variant="outline">
				<Link href="/sign-in">Sign in</Link>
			</Button>
			<Button asChild size="sm" variant="default">
				<Link href="/sign-up">Sign up</Link>
			</Button>
		</div>
	);
}
