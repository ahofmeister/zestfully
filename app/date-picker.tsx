"use client"

import * as React from "react"
import {format} from "date-fns"
import {CalendarIcon} from 'lucide-react'

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Label} from "@/components/ui/label"

interface DatePickerProps {
    selected?: Date
    onSelectAction: (date: Date | undefined) => void
    label: string
}

export function DatePicker({selected, onSelectAction, label}: DatePickerProps) {
    return (
        <div className="flex flex-col space-y-2">
            <Label htmlFor={label}>{label}</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={label}
                        variant={"outline"}
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !selected && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4"/>
                        {selected ? format(selected, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={selected}
                        onSelect={onSelectAction}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

