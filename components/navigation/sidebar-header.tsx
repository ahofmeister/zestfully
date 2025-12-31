import Image from "next/image";
import Link from "next/link";

export function SidebarHeader({
	logoSrc,
	title,
	href,
}: {
	logoSrc: string;
	title: string;
	href: string;
}) {
	return (
		<Link
			href={href}
			className="h-16 px-6 flex items-center border-b border-border"
		>
			<div className="flex items-center gap-3">
				<Image
					src={logoSrc}
					alt={title}
					width={32}
					height={32}
					className="shrink-0"
				/>
				<span className="text-lg font-semibold hover:cursor-pointer text-primary">
					{title}
				</span>
			</div>
		</Link>
	);
}
