import { WeekNavigation } from "@/app/planner/week-navigation";
import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { createClient } from "@/utils/supabase/server";
import { MealPlan } from "@/utils/supabase/types";
import DeleteMealEntry from "@/app/planner/delete-meal-entry";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddMeal } from "@/app/planner/addMeal";

function MealEntries(props: { data: MealPlan[]; date: Date }) {
  let mealPlans = props.data?.filter(
    (entry) => entry.date === format(props.date, "yyyy-MM-dd"),
  );

  if (mealPlans.length === 0) {
    return <Card><CardHeader>
      <CardTitle className={"text-muted-foreground"}>
        No meals yet
      </CardTitle>
    </CardHeader></Card>;
  }

  return (
    <div className={"flex flex-col gap-y-2"}>
      {mealPlans?.map((entry) => (
        <Card className={""}>
          <CardHeader>
            <CardTitle className={"flex justify-between items-center"}>
              {entry.meal}
              <DeleteMealEntry id={entry.id} />
            </CardTitle>
            <CardDescription>
              <Badge>{entry.meal_type}</Badge>
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default async function MealPrepPage(props: {
  searchParams: Promise<{
    date: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const weekStart = startOfWeek(
    searchParams.date ? parseISO(searchParams.date) : new Date(),
    {
      weekStartsOn: 1,
    },
  );

  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

  const supabase = await createClient();
  const { data } = await supabase
    .from("meal")
    .select("*")
    .in(
      "date",
      weekDays.map((weekDay) => format(weekDay, "yyyy-MM-dd")),
    );

  return (
    <div className="p-2">
      <WeekNavigation currentDate={weekStart} />

      <div className="">
        <div className="">
          {weekDays.map((date) => (
            <div key={date.toString()} className={"my-4"}>
              <div className="flex flex-col p-2 gap-y-6">
                <div className="flex gap-x-4 w-full items-center justify-between">
                  <div className="text-lg font-medium">
                    {format(date, "EEEE")}
                  </div>
                  <AddMeal date={date} />
                </div>

                <MealEntries data={data ?? []} date={date} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
