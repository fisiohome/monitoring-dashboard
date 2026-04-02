"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFilterParams } from "@/lib/hooks/use-filter-params";
import { FilterChip } from "@/components/sections/appointmets/filter-chip";
import { FieldInput } from "@/components/sections/appointmets/field-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FeedbackFilterBar() {
  const { get, set, clear } = useFilterParams();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const search = get("registration_number");
  const patientNameFilter = get("patient_name");
  const therapistNameFilter = get("therapist_name");
  const startDateFilter = get("start_date");
  const endDateFilter = get("end_date");

  const activeFilters = useMemo(
    () => [
      ...(patientNameFilter
        ? [
            {
              label: `Patient: ${patientNameFilter}`,
              removeKey: "patient_name",
            },
          ]
        : []),
      ...(therapistNameFilter
        ? [
            {
              label: `Therapist: ${therapistNameFilter}`,
              removeKey: "therapist_name",
            },
          ]
        : []),
      ...(startDateFilter
        ? [{ label: `From: ${startDateFilter}`, removeKey: "start_date" }]
        : []),
      ...(endDateFilter
        ? [{ label: `To: ${endDateFilter}`, removeKey: "end_date" }]
        : []),
    ],
    [patientNameFilter, therapistNameFilter, startDateFilter, endDateFilter],
  );

  useEffect(() => {
    const hasAdvanced =
      patientNameFilter ||
      therapistNameFilter ||
      startDateFilter ||
      endDateFilter;
    if (hasAdvanced) setShowAdvanced(true);
  }, []);

  const removeChip = (key: string) => {
    set({ [key]: null });
  };

  const advancedFilterCount = activeFilters.length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <div className="relative flex-1 min-w-0 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
          <Input
            type="text"
            placeholder="Search by registration number..."
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                set({
                  registration_number: (e.target as HTMLInputElement).value,
                });
            }}
            onBlur={(e) => set({ registration_number: e.target.value })}
            className="pl-9 h-9 bg-slate-50/50 w-full"
          />
        </div>

        <Button
          variant={showAdvanced ? "secondary" : "outline"}
          onClick={() => setShowAdvanced((v) => !v)}
          className="h-9 gap-2 shrink-0 px-3"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">More filters</span>
          {advancedFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">
              {advancedFilterCount}
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              showAdvanced && "rotate-180",
            )}
          />
        </Button>

        {(activeFilters.length > 0 || search) && (
          <Button
            variant="ghost"
            onClick={clear}
            className="h-9 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0 gap-1.5"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="px-4 py-4 bg-slate-50/60 border-b border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <FieldInput
              label="Patient Name"
              placeholder="Search patient name..."
              defaultValue={patientNameFilter}
              onCommit={(v) => set({ patient_name: v })}
            />
            <FieldInput
              label="Therapist Name"
              placeholder="Search therapist name..."
              defaultValue={therapistNameFilter}
              onCommit={(v) => set({ therapist_name: v })}
            />
            <FieldInput
              label="Start Date"
              type="date"
              defaultValue={startDateFilter}
              onCommit={(v) => set({ start_date: v })}
            />
            <FieldInput
              label="End Date"
              type="date"
              defaultValue={endDateFilter}
              onCommit={(v) => set({ end_date: v })}
            />
          </div>
        </div>
      )}

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-2.5">
          {activeFilters.map((f, i) => (
            <FilterChip
              key={`${f.removeKey}-${i}`}
              label={f.label}
              onRemove={() => removeChip(f.removeKey)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
