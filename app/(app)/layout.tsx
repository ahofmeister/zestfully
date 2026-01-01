import "../globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import { Suspense } from "react";
import MainNavigation from "@/components/navigation/main-navigation";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={"flex h-screen"}>
			<Suspense>
				<MainNavigation />
			</Suspense>
			<main className="w-full pt-20 lg:pt-8 overflow-y-auto pb-28 lg:pb-4">
				<NuqsAdapter>{children}</NuqsAdapter>
			</main>
		</div>
	);
}
