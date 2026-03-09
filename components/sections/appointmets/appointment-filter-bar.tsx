"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFilterParams } from "@/lib/hooks/use-filter-params";
import { StatusMultiSelect } from "@/components/sections/appointmets/status-multi-select";
import { FilterChip } from "@/components/sections/appointmets/filter-chip";
import { FieldInput } from "@/components/sections/appointmets/field-input";
import { FieldSelect } from "@/components/sections/appointmets/field-select";

export function AppointmentFilterBar() {
  const { get, getAll, set, clear } = useFilterParams();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const search = get("registration_number");
  const statusFilters = getAll("status");
  const patientNameFilter = get("patient_name");
  const therapistNameFilter = get("therapist_name");
  const patientNumberFilter = get("patient_number");
  const orderIdFilter = get("order_id");
  const dateFilter = get("date");
  const startDateFilter = get("start_date");
  const endDateFilter = get("end_date");
  const isSoapExists = get("soap", "all");
  const isEvidenceExists = get("evidence", "all");

  const activeFilters: {
    label: string;
    removeKey: string;
    removeValue?: string;
  }[] = useMemo(
    () => [
      ...statusFilters.map((s) => ({
        label: s.replace(/_/g, " "),
        removeKey: "status",
        removeValue: s,
      })),
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
      ...(patientNumberFilter
        ? [
            {
              label: `Patient No: ${patientNumberFilter}`,
              removeKey: "patient_number",
            },
          ]
        : []),
      ...(orderIdFilter
        ? [
            {
              label: `Order: ${orderIdFilter.slice(0, 8)}...`,
              removeKey: "order_id",
            },
          ]
        : []),
      ...(dateFilter
        ? [{ label: `Date: ${dateFilter}`, removeKey: "date" }]
        : []),
      ...(startDateFilter
        ? [{ label: `From: ${startDateFilter}`, removeKey: "start_date" }]
        : []),
      ...(endDateFilter
        ? [{ label: `To: ${endDateFilter}`, removeKey: "end_date" }]
        : []),
      ...(isSoapExists !== "all"
        ? [
            {
              label: `SOAP: ${isSoapExists === "true" ? "Yes" : "No"}`,
              removeKey: "soap",
            },
          ]
        : []),
      ...(isEvidenceExists !== "all"
        ? [
            {
              label: `Evidence: ${isEvidenceExists === "true" ? "Yes" : "No"}`,
              removeKey: "evidence",
            },
          ]
        : []),
    ],
    [
      statusFilters,
      patientNameFilter,
      therapistNameFilter,
      patientNumberFilter,
      orderIdFilter,
      dateFilter,
      startDateFilter,
      endDateFilter,
      isSoapExists,
      isEvidenceExists,
    ],
  );

  useEffect(() => {
    const hasAdvanced =
      patientNameFilter ||
      therapistNameFilter ||
      patientNumberFilter ||
      orderIdFilter ||
      dateFilter ||
      startDateFilter ||
      endDateFilter ||
      isSoapExists !== "all" ||
      isEvidenceExists !== "all";
    if (hasAdvanced) setShowAdvanced(true);
  }, []);

  const removeChip = (key: string, value?: string) => {
    if (key === "status" && value) {
      set({ status: statusFilters.filter((s) => s !== value) });
    } else {
      set({ [key]: null });
    }
  };

  const advancedFilterCount = activeFilters.filter(
    (f) => f.removeKey !== "status",
  ).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
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
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition placeholder:text-slate-400"
          />
        </div>

        <StatusMultiSelect
          selected={statusFilters}
          onChange={(values) => set({ status: values })}
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
          {advancedFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold">
              {advancedFilterCount}
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

      {showAdvanced && (
        <div className="px-4 py-4 bg-slate-50/60 border-b border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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
              label="Patient Number"
              placeholder="Search patient number..."
              defaultValue={patientNumberFilter}
              onCommit={(v) => set({ patient_number: v })}
            />
            <FieldInput
              label="Order ID"
              placeholder="UUID"
              defaultValue={orderIdFilter}
              onCommit={(v) => set({ order_id: v })}
            />
            <FieldInput
              label="Specific Date"
              type="date"
              defaultValue={dateFilter}
              onCommit={(v) => set({ date: v })}
            />
            <FieldInput
              label="Start Date"
              type="datetime-local"
              defaultValue={startDateFilter}
              onCommit={(v) => set({ start_date: v })}
            />
            <FieldInput
              label="End Date"
              type="datetime-local"
              defaultValue={endDateFilter}
              onCommit={(v) => set({ end_date: v })}
            />
            <FieldSelect
              label="Has SOAP?"
              value={isSoapExists}
              onChange={(v) => set({ soap: v })}
              options={[
                { value: "all", label: "Any" },
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />
            <FieldSelect
              label="Has Evidence?"
              value={isEvidenceExists}
              onChange={(v) => set({ evidence: v })}
              options={[
                { value: "all", label: "Any" },
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />
          </div>
        </div>
      )}

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
