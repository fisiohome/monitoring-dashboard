"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFilterParams } from "@/lib/hooks/use-filter-params";
import { StatusMultiSelect } from "@/components/sections/appointmets/status-multi-select";
import { FilterChip } from "@/components/sections/appointmets/filter-chip";
import { FieldInput } from "@/components/sections/appointmets/field-input";
import { FieldSelect } from "@/components/sections/appointmets/field-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AppointmentFilterBar() {
  const { get, getAll, set, clear } = useFilterParams();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const search = get("registration_number");
  const statusFilters = getAll("status");
  const patientNameFilter = get("patient_name");
  const therapistNameFilter = get("therapist_name");
  const therapistTypeFilter = get("therapist_type");
  const patientNumberFilter = get("patient_number");
  const orderIdFilter = get("order_id");
  const dateFilter = get("date");
  const startDateFilter = get("start_date");
  const endDateFilter = get("end_date");
  const isSoapExists = get("soap", "all");
  const isEvidenceExists = get("evidence", "all");
  const sortBy = get("sort_by", "created_at");
  const sortOrder = get("sort_order", "desc");

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
      ...(therapistTypeFilter
        ? [
            {
              label: `Type: ${therapistTypeFilter}`,
              removeKey: "therapist_type",
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
      ...(sortBy !== "created_at"
        ? [
            {
              label: `Sort: ${sortBy.replace(/_/g, " ")}`,
              removeKey: "sort_by",
            },
          ]
        : []),
      ...(sortOrder !== "desc"
        ? [
            {
              label: `Order: ${sortOrder === "asc" ? "Ascending" : "Descending"}`,
              removeKey: "sort_order",
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
      sortBy,
      sortOrder,
    ],
  );

  useEffect(() => {
    const hasAdvanced =
      patientNameFilter ||
      therapistNameFilter ||
      therapistTypeFilter ||
      patientNumberFilter ||
      orderIdFilter ||
      dateFilter ||
      startDateFilter ||
      endDateFilter ||
      isSoapExists !== "all" ||
      isEvidenceExists !== "all" ||
      sortBy !== "created_at" ||
      sortOrder !== "desc";
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

        <StatusMultiSelect
          selected={statusFilters}
          onChange={(values) => set({ status: values })}
        />

        <Button
          variant={showAdvanced ? "secondary" : "outline"}
          onClick={() => setShowAdvanced((v) => !v)}
          className="h-9 gap-2 shrink-0"
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

        {activeFilters.length > 0 && (
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
            <FieldSelect
              label="Therapist Type"
              value={therapistTypeFilter || "all"}
              onChange={(v) => set({ therapist_type: v === "all" ? null : v })}
              options={[
                { value: "all", label: "Any" },
                { value: "internal", label: "Internal" },
                { value: "external", label: "External" },
              ]}
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
            <FieldSelect
              label="Sort By"
              value={sortBy}
              onChange={(v) => set({ sort_by: v })}
              options={[
                { value: "created_at", label: "Created At" },
                {
                  value: "appointment_date_time",
                  label: "Appointment Date",
                },
                { value: "registration_number", label: "Reg. Number" },
                { value: "status", label: "Status" },
              ]}
            />
            <FieldSelect
              label="Sort Order"
              value={sortOrder}
              onChange={(v) => set({ sort_order: v })}
              options={[
                { value: "desc", label: "Descending" },
                { value: "asc", label: "Ascending" },
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
