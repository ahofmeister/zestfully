import { Menu } from "lucide-react";
import Image from "next/image";

interface MobileHeaderProps {
	onMenuToggle: () => void;
}

export function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
	return (
		<div className="md:hidden fixed top-0 left-0 right-0 z-70 bg-background flex justify-between items-center px-4 py-3 border-b border-border">
			<Image
				src="/icon-192x192.png"
				alt="Frugalistic"
				width={32}
				height={32}
				className="shrink-0"
			/>
			<button
				type="button"
				className="p-2 rounded-lg hover:bg-accent"
				onClick={onMenuToggle}
				aria-label="Toggle menu"
			>
				<Menu className="h-5 w-5 text-foreground" />
			</button>
		</div>
	);
}
