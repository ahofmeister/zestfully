import {type KeyboardEvent, useCallback, useEffect, useRef, useState} from "react"
import {cn} from "@/lib/utils";
import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Food} from "@/utils/supabase/types";
import {createClient} from "@/utils/supabase/client";

type AutoCompleteProps = {
    value?: Food
    onValueChange?: (value: Food) => void
    disabled?: boolean
    placeholder?: string
    foods: Food[]
}

export const FoodAutoComplete = ({
                                     placeholder,
                                     value,
                                     onValueChange,
                                     disabled,
    foods
                                 }: AutoCompleteProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [isOpen, setOpen] = useState(false)
    const [selected, setSelected] = useState<Food | undefined>(value)
    const [inputValue, setInputValue] = useState<string>(value?.name || "")

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current
            if (!input) {
                return
            }

            if (!isOpen) {
                setOpen(true)
            }

            if (event.key === "Enter" && input.value !== "") {

                const optionToSelect = foods.find(
                    (option) => option.name?.toString() === inputValue,
                )

                if (optionToSelect) {
                    setSelected(optionToSelect)
                    onValueChange?.(optionToSelect)

                    setInputValue('')
                }
            }

            if (event.key === "Escape") {
                input.blur()
            }
        },
        [isOpen, foods, onValueChange],
    )

    const handleBlur = useCallback(() => {
        setOpen(false)
    }, [selected])

    const handleSelectOption = useCallback(
        (selectedOption: Food) => {
            setInputValue(selectedOption.name!)

            setSelected(selectedOption)
            onValueChange?.(selectedOption)
            setInputValue("")
            // This is a hack to prevent the input from being focused after the user selects an option
            // We can call this hack: "The next tick"
            setTimeout(() => {
                inputRef?.current?.blur()
            }, 0)
        },
        [onValueChange],
    )


    return (
        <Command onKeyDown={handleKeyDown}>
            <CommandInput
                ref={inputRef}
                value={inputValue}
                onValueChange={setInputValue}
                onBlur={handleBlur}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
            />
            <div className="relative mt-1">
                <div
                    className={cn(
                        isOpen ? "block" : "hidden",
                    )}
                >
                    <CommandList>
                        {foods.length > 0 ? (
                            <CommandGroup>
                                {foods.map((option) => {
                                    return (
                                        <CommandItem
                                            key={option.id}
                                            value={option.id?.toString() + " " + option.name}
                                            onMouseDown={(event: any) => {
                                                event.preventDefault()
                                                event.stopPropagation()
                                            }}
                                            onSelect={() => handleSelectOption(option)}
                                            className={cn(
                                                "flex w-full items-center gap-2",
                                            )}
                                        >
                                            <span>{option?.name}</span>

                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        ) : null}
                    </CommandList>
                </div>
            </div>
        </Command>
    )
}