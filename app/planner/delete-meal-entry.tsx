"use client";
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {deleteEntry} from "@/app/planner/planner-actions";

const DeleteMealEntry = (props: { id: string }) => {
  return (
    <div>
      <Button
        size={"sm"}
        variant={"outline"}
        onClick={() => deleteEntry(props.id)}
      >
        <X size={"12"} />
      </Button>
    </div>
  );
};

export default DeleteMealEntry;
