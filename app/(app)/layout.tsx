import "../globals.css";

import { eq } from "drizzle-orm";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import MainNavigation from "@/components/navigation/main-navigation";
import { dbTransaction } from "@/drizzle/client";
import { profileSchema } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const profile = user
		? await dbTransaction(async (tx) => {
				const results = await tx
					.select()
					.from(profileSchema)
					.where(eq(profileSchema.userId, user.id))
					.limit(1);

				return results[0];
			})
		: undefined;

	return (
		<div className="flex h-screen">
			<MainNavigation username={profile?.username} />
			<main className="w-full lg:pt-8 overflow-y-auto pb-28 lg:pb-4 px-4 md:px-8 mx-auto max-w-7xl">
				<NuqsAdapter>{children}</NuqsAdapter>
			</main>
		</div>
	);
}
