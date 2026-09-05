import { ilike } from "drizzle-orm";
import type { SearchParams } from "nuqs/server";
import { loadFoodSearchParams } from "@/app/(app)/foods/food-search-params";
import { MacroValue } from "@/app/(app)/home/macro-value";
import { macroColors } from "@/app/(app)/home/nutrition-calculation";
import SearchInput from "@/components/search/search-input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { dbTransaction } from "@/drizzle/client";

const FoodPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
	const { query } = await loadFoodSearchParams(searchParams);

	const foods = await dbTransaction((tx) => {
		return tx.query.foodSchema.findMany({
			where: query ? (t) => ilike(t.name, `%${query}%`) : undefined,
			orderBy: (t, { asc }) => [asc(t.name)],
		});
	});

	return (
		<div className="flex flex-col gap-y-4">
			<SearchInput placeholder="Search foods..." />
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
