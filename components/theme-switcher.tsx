"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const ThemeSwitcher = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	const ICON_SIZE = 16;

	const themes = useMemo(() => ["light", "dark", "system"] as const, []);
	const nextTheme = () => {
		const currentIndex = themes.indexOf(theme as (typeof themes)[number]);
		const nextIndex = (currentIndex + 1) % themes.length;
		setTheme(themes[nextIndex]);
	};

	if (!mounted) return null;

	const themeIcon = (() => {
		switch (theme) {
			case "light":
				return (
					<Sun key="light" size={ICON_SIZE} className="text-muted-foreground" />
				);
			case "dark":
				return (
					<Moon key="dark" size={ICON_SIZE} className="text-muted-foreground" />
				);
			default:
				return (
					<Laptop
						key="system"
						size={ICON_SIZE}
						className="text-muted-foreground"
					/>
				);
		}
	})();

	return (
		<Button variant="ghost" size="sm" onClick={nextTheme}>
			{themeIcon}
		</Button>
	);
};

export { ThemeSwitcher };
