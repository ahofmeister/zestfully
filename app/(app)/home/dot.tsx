export function Dot({ colorVar }: { colorVar: string }) {
	return (
		<span
			className="size-2 shrink-0 rounded-full"
			style={{ backgroundColor: `var(${colorVar})` }}
			aria-hidden
		/>
	);
}
