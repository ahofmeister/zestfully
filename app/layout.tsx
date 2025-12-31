import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import type { Viewport } from "next";
import type React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Zestfully",
	description: "Start here, every day. Your life, all in one place.",
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
						<div className="flex-1 overflow-y-auto">
							<TooltipProvider delayDuration={300}>{children}</TooltipProvider>
						</div>
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
