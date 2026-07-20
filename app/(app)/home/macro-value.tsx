import { Dot } from "@/app/(app)/home/dot";
import { round } from "@/app/(app)/home/nutrition-calculation";

export function MacroValue({ colorVar, value }: { colorVar: string; value: number }) {
	return (
		<span className="flex w-16 items-center justify-end gap-1.5">
			<Dot colorVar={colorVar} />
			<span className="text-foreground">{round(value, 1)}g</span>
		</span>
	);
}
