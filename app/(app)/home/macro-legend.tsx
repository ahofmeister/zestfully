import { macroColors } from "@/app/(app)/home/nutrition-calculation";
import { capitalizeFirstLetter } from "@/components/strings";

export function MacroLegend() {
	return (
		<div className="mt-3 flex items-center justify-center gap-5 text-xs text-muted-foreground">
			{Object.keys(macroColors).map((item) => {
				const color = macroColors[item as keyof typeof macroColors];

				return (
					<span key={color} className="flex items-center gap-1.5">
						<span
							className="size-2 rounded-full"
							style={{ backgroundColor: `var(${color})` }}
							aria-hidden
						/>
						{capitalizeFirstLetter(item)}
					</span>
				);
			})}
		</div>
	);
}
