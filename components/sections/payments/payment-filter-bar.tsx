"use client";

import { Search, SlidersHorizontal, ChevronDown, X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useFilterParams } from "@/lib/hooks/use-filter-params";
import { FilterChip } from "@/components/sections/appointmets/filter-chip";
import { FieldInput } from "@/components/sections/appointmets/field-input";
import { FieldSelect } from "@/components/sections/appointmets/field-select";
import { PAYMENT_STATUS_OPTIONS, PAYMENT_SORT_OPTIONS } from "./constants";
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

function PaymentStatusMultiSelect({
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
        <button
          className={cn(
            "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition min-w-40 justify-between shrink-0",
            selected.length > 0
              ? "bg-violet-50 border-violet-200 text-violet-800"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300",
          )}
        >
          <span className="flex items-center gap-1.5 truncate">
            {selected.length === 0 ? (
              <span className="font-medium text-slate-600">Payment Status</span>
            ) : selected.length === 1 ? (
              <span className="truncate font-medium">
                {PAYMENT_STATUS_OPTIONS.find((o) => o.value === selected[0])
                  ?.label || selected[0]}
              </span>
            ) : (
              <span className="font-medium">{selected.length} statuses</span>
            )}
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform opacity-50",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-white" align="start">
        <Command>
          <CommandInput placeholder="Search status..." className="h-9" />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
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

export function PaymentFilterBar() {
  const { get, getAll, set, clear } = useFilterParams();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const search = get("search");
  const paymentStatusFilters = getAll("payment_status");
  const patientNameFilter = get("patient_name");
  const registrationNumberFilter = get("registration_number");
  const orderStartDateFilter = get("order_start_date");
  const orderEndDateFilter = get("order_end_date");
  const sortByFilter = get("sort_by", "created_at");
  const sortOrderFilter = get("sort_order", "desc");

  const activeFilters: {
    label: string;
    removeKey: string;
    removeValue?: string;
  }[] = [
    ...paymentStatusFilters.map((s) => ({
      label: s.replace(/_/g, " "),
      removeKey: "payment_status",
      removeValue: s,
    })),
    ...(patientNameFilter
      ? [{ label: `Patient: ${patientNameFilter}`, removeKey: "patient_name" }]
      : []),
    ...(registrationNumberFilter
      ? [
          {
            label: `Reg: ${registrationNumberFilter}`,
            removeKey: "registration_number",
          },
        ]
      : []),
    ...(orderStartDateFilter
      ? [
          {
            label: `From: ${orderStartDateFilter}`,
            removeKey: "order_start_date",
          },
        ]
      : []),
    ...(orderEndDateFilter
      ? [{ label: `To: ${orderEndDateFilter}`, removeKey: "order_end_date" }]
      : []),
  ];

  const removeChip = (key: string, value?: string) => {
    if (key === "payment_status" && value) {
      set({
        payment_status: paymentStatusFilters.filter((s) => s !== value),
      });
    } else {
      set({ [key]: null });
    }
  };

  useEffect(() => {
    const hasAdvanced =
      patientNameFilter ||
      registrationNumberFilter ||
      orderStartDateFilter ||
      orderEndDateFilter;
    if (hasAdvanced) setShowAdvanced(true);
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Primary row */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer…"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                set({ search: (e.target as HTMLInputElement).value });
            }}
            onBlur={(e) => set({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition placeholder:text-slate-400"
          />
        </div>

        <PaymentStatusMultiSelect
          selected={paymentStatusFilters}
          onChange={(values) => set({ payment_status: values })}
        />

        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition shrink-0",
            showAdvanced
              ? "bg-violet-50 border-violet-200 text-violet-700"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300",
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          More filters
          {activeFilters.filter((f) => f.removeKey !== "payment_status")
            .length > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold">
              {
                activeFilters.filter((f) => f.removeKey !== "payment_status")
                  .length
              }
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              showAdvanced && "rotate-180",
            )}
          />
        </button>

        {activeFilters.length > 0 && (
          <button
            onClick={clear}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition shrink-0"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced row */}
      {showAdvanced && (
        <div className="px-4 py-4 bg-slate-50/60 border-b border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <FieldInput
              label="Patient Name"
              placeholder="Search patient…"
              defaultValue={patientNameFilter}
              onCommit={(v) => set({ patient_name: v })}
            />
            <FieldInput
              label="Registration Number"
              placeholder="e.g. REG-001"
              defaultValue={registrationNumberFilter}
              onCommit={(v) => set({ registration_number: v })}
            />
            <FieldInput
              label="Order Start Date"
              type="date"
              defaultValue={orderStartDateFilter}
              onCommit={(v) => set({ order_start_date: v })}
            />
            <FieldInput
              label="Order End Date"
              type="date"
              defaultValue={orderEndDateFilter}
              onCommit={(v) => set({ order_end_date: v })}
            />
            <FieldSelect
              label="Sort By"
              value={sortByFilter}
              onChange={(v) => set({ sort_by: v })}
              options={PAYMENT_SORT_OPTIONS}
            />
            <FieldSelect
              label="Sort Order"
              value={sortOrderFilter}
              onChange={(v) => set({ sort_order: v })}
              options={[
                { value: "desc", label: "Newest First" },
                { value: "asc", label: "Oldest First" },
              ]}
            />
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-2.5">
          {activeFilters.map((f, i) => (
            <FilterChip
              key={`${f.removeKey}-${f.removeValue ?? i}`}
              label={f.label}
              onRemove={() => removeChip(f.removeKey, f.removeValue)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
