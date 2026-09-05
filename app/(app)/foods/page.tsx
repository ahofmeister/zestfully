import { MacroValue } from "@/app/(app)/home/macro-value";
import { macroColors } from "@/app/(app)/home/nutrition-calculation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { dbTransaction } from "@/drizzle/client";

const FoodPage = async () => {
	const foods = await dbTransaction((tx) => {
		return tx.query.foodSchema.findMany({
			orderBy: (t, { asc }) => [asc(t.name)],
		});
	});

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-25">Name</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Energy</TableHead>
						<TableHead>Protein</TableHead>
						<TableHead>Fat</TableHead>
						<TableHead>Carbs</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{foods?.map((food) => (
						<TableRow key={food.id}>
							<TableCell>{food.name}</TableCell>
							<TableCell>Category</TableCell>
							<TableCell>{food.energy}</TableCell>
							<TableCell>
								<MacroValue colorVar={macroColors.protein} value={food.protein} />
							</TableCell>
							<TableCell>
								<MacroValue colorVar={macroColors.fat} value={food.fat} />
							</TableCell>
							<TableCell>
								<MacroValue colorVar={macroColors.carbohydrates} value={food.carbohydrates} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default FoodPage;
