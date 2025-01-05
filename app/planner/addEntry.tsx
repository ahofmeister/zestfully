"use client";
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { addPlanStuff } from "@/app/planner/planner-actions";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {PlusIcon} from "lucide-react";

export function AddEntry(props: { date: Date }) {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    void addPlanStuff({
      date: format(props.date, "yyyy-MM-dd"),
      meal: formData!.get("meal") as string,
      meal_time: formData!.get("time") as string,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"} size={"iconSm"}>
          <PlusIcon size={"15"} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create for {format(props.date, "EEEE")}</DialogTitle>
            <DialogDescription className={"flex flex-col gap-y-4"}>
              <Input name={"meal"} />

              <Input name={"time"} />
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
