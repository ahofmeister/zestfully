"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, addWeeks, format, startOfWeek } from "date-fns";
import useUpdateQueryParams from "@/app/use-update-query-params";
import { useState } from "react";

interface WeekNavigationProps {
  currentDate: Date;
}

export function WeekNavigation({ currentDate }: WeekNavigationProps) {
  const update = useUpdateQueryParams();
  const [date, setDate] = useState<Date>(currentDate);

  const updateDate = (newDate: Date) => {
    setDate(newDate);
    update({ key: "date", value: format(newDate, "yyyy-MM-dd") });
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => updateDate(addWeeks(date, -1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-lg font-semibold">
        {format(date, "dd. MM yyyy")} -{" "}
        {format(addDays(date, 7), "dd. MM yyyy")}
      </h2>
      <Button
        variant="outline"
        size="icon"
        onClick={() => updateDate(addWeeks(date, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        onClick={() => updateDate(startOfWeek(new Date(), { weekStartsOn: 1 }))}
      >
        Today
      </Button>
    </div>
  );
}
