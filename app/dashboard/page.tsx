import { eq, getTableColumns } from "drizzle-orm";
import { notFound } from "next/navigation";
import { MealSection } from "@/app/dashboard/meal-section";
import { calculateEnergy, calculateProtein } from "@/app/dashboard/nutrition-calculation";
import { loadSearchParams } from "@/components/dashboard/date-parser";
import { DateSelector } from "@/components/dashboard/date-selector";
import { db } from "@/drizzle/client";
import { food, mealItems } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";

export default async function RecipesPage(props: {
  searchParams: Promise<{
    date: string;
  }>;
}) {
  const { date } = await loadSearchParams(props.searchParams);

  const supabaseClient = await createClient();

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return notFound();
  }

  const items = await db
    .select({
      ...getTableColumns(mealItems),
      food: food,
    })
    .from(mealItems)
    .innerJoin(food, eq(mealItems.foodId, food.id))
    .where(eq(mealItems.date, date.toISOString()));

  const grouped = {
    breakfast: items.filter((i) => i.mealType === "breakfast"),
    lunch: items.filter((i) => i.mealType === "lunch"),
    dinner: items.filter((i) => i.mealType === "dinner"),
    snack: items.filter((i) => i.mealType === "snack"),
  };

  const calculateTotalEnergy = (mealItems: typeof items) => {
    return mealItems.reduce((sum, item) => sum + calculateEnergy(item.quantity, item.food.energy), 0);
  };

  const calculateTotalProtein = (mealItems: typeof items) => {
    return mealItems.reduce((sum, item) => sum + calculateProtein(item.quantity, item.food.protein), 0);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <DateSelector />
      </div>
      <div className={"flex justify-between mb-2"}>
        <div className="bg-primary text-primary-foreground w-fit py-1 px-4">
          <div className="text-xl">
            <span>{calculateTotalEnergy(items)} cal</span>
            <span className="mx-2">•</span>
            <span>{calculateTotalProtein(items)}g protein</span>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {(["breakfast", "lunch", "dinner", "snack"] as const).map((meal) => (
          <div key={meal} className="flex flex-col gap-2">
            <div className={"flex flex-col gap-y-2"}>
              <div className={"self-end"}>
                <MealSection title={meal.charAt(0).toUpperCase() + meal.slice(1)} items={grouped[meal]} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
