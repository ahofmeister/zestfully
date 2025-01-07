import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Viewport } from "next";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

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
            <nav className="sticky top-0 backdrop-blur  w-full justify-between flex border-b border-b-foreground/10 h-14">
              <NavigationMenu>
                <NavigationMenuList>

                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref className={""}>
                      <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                      >
                        <div className={"font-bold text-primary"}>Zestfully</div>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                </NavigationMenuList>
              </NavigationMenu>
              <div className="flex items-center text-sm justify-self-end">
                <HeaderAuth />
                <ThemeSwitcher />
              </div>
            </nav>
            <div className="mx-2 mt-8 md:mt-4 flex-1 overflow-y-auto">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
