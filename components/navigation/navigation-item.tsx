"use client";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { Badge } from "@/components/ui/badge";

export function NavigationItem({
	href,
	icon: Icon,
	children,
	noLink,
	onClick,
	onNavigate,
	soon = false,
}: {
	href?: string;
	icon?: LucideIcon;
	children: React.ReactNode;
	noLink?: boolean;
	onClick?: () => void;
	onNavigate?: () => void;
	soon?: boolean;
}) {
	const pathname = usePathname();
	const isActive = href && pathname === href;

	const content = (
		<>
			{Icon && <Icon className="h-4 w-4 mr-3 shrink-0" />}
			<div className="flex gap-x-2 items-center flex-1">
				{children}
				{soon && <Badge variant="secondary">Soon</Badge>}
			</div>
		</>
	);

	const baseClasses =
		"flex items-center px-3 py-2 text-sm rounded-md transition-colors";
	const activeClasses = isActive
		? "bg-accent text-foreground font-medium"
		: "text-muted-foreground hover:text-foreground hover:bg-accent";

	if (noLink || onClick) {
		return (
			<button
				type="button"
				onClick={onClick}
				className={`${baseClasses} ${activeClasses} cursor-pointer`}
			>
				{content}
			</button>
		);
	}

	return (
		<Link
			href={href || "#"}
			onClick={onNavigate}
			className={`${baseClasses} ${activeClasses}`}
		>
			{content}
		</Link>
	);
}
