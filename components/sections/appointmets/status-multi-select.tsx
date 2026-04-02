"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { STATUS_OPTIONS, STATUS_STYLES } from "./constants";

export function StatusMultiSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((s) => s !== value)
        : [...selected, value],
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selected.length > 0 ? "secondary" : "outline"}
          className="h-9 min-w-35 justify-between font-normal px-3"
        >
          <span className="flex items-center gap-1.5 truncate">
            {selected.length === 0 ? (
              <span className="text-slate-500">All statuses</span>
            ) : selected.length === 1 ? (
              <span className="truncate">{selected[0].replace(/_/g, " ")}</span>
            ) : (
              <span>{selected.length} statuses</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-white" align="start">
        <Command>
          <CommandInput placeholder="Search status..." className="h-9" />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {STATUS_OPTIONS.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={() => toggle(opt.value)}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded border",
                      selected.includes(opt.value)
                        ? "bg-violet-600 border-violet-600 text-white"
                        : "border-slate-300",
                    )}
                  >
                    {selected.includes(opt.value) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <span className="flex-1">{opt.label}</span>
                  {selected.includes(opt.value) && (
                    <span
                      className={cn(
                        "ml-auto h-2 w-2 rounded-full",
                        STATUS_STYLES[opt.value]?.includes("blue")
                          ? "bg-blue-500"
                          : STATUS_STYLES[opt.value]?.includes("emerald")
                            ? "bg-emerald-500"
                            : STATUS_STYLES[opt.value]?.includes("red")
                              ? "bg-red-500"
                              : STATUS_STYLES[opt.value]?.includes("violet")
                                ? "bg-violet-500"
                                : "bg-amber-500",
                      )}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {selected.length > 0 && (
            <div className="border-t p-2">
              <button
                onClick={() => onChange([])}
                className="w-full text-xs text-center text-slate-500 hover:text-red-500 py-1 transition-colors"
              >
                Clear selection
              </button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
