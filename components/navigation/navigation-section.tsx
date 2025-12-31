export function NavigationSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
				{title}
			</div>
			<div className="space-y-1">{children}</div>
		</div>
	);
}
