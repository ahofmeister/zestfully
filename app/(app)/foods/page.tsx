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
							<TableCell>{food.protein}</TableCell>
							<TableCell>{food.fat}</TableCell>
							<TableCell>{food.carbohydrates}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default FoodPage;
