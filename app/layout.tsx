import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import "./globals.css";
import type { Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Zestfully",
	description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
	display: "swap",
	subsets: ["latin"],
});

export const viewport: Viewport = {
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={geistSans.className} suppressHydrationWarning>
			<body className="bg-background text-foreground">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<main>
						<nav className="sticky top-0 backdrop-blur-sm  w-full justify-between flex border-b border-b-foreground/10 h-14">
							<NavigationMenu>
								<NavigationMenuList>
									<NavigationMenuItem>
										<NavigationMenuLink href={"/"}>
											<div className={"text-primary ml-4"}>Zestfully</div>
										</NavigationMenuLink>
									</NavigationMenuItem>
									<NavigationMenuItem>
										<NavigationMenuLink href={"/home"}>Home</NavigationMenuLink>
									</NavigationMenuItem>
								</NavigationMenuList>
							</NavigationMenu>
							<div className="flex items-center text-sm justify-self-end">
								<HeaderAuth />
								<ThemeSwitcher />
							</div>
						</nav>
						<div className="mx-2 mt-8 md:mt-4 flex-1 overflow-y-auto">
							<NuqsAdapter>{children}</NuqsAdapter>
						</div>
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
