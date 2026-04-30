"use client";

import { Suspense, useState, useEffect } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useFilterParams } from "@/lib/hooks/use-filter-params";
import { ExportExcelButton } from "@/components/ui/ExportExcelButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchReminderData } from "@/lib/api/dashboard";
import { ReminderDataItem } from "@/lib/api/types";
import { fetchAllPages } from "@/lib/export-utils";
import { exportRemindersCustom } from "@/lib/reminders-export";
import { toast } from "sonner";

function RemindersPageInner() {
  const { get, set } = useFilterParams();

  // Set default date to tomorrow for reminders only if no date-related filters are present
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = format(tomorrow, "yyyy-MM-dd");

  const dateStr = get("date", "");
  const startDateStr = get("start_date", "");
  const endDateStr = get("end_date", "");
  const patientNameStr = get("patient_name", "");

  // On mount, if no date filters are present, set default to tomorrow
  useEffect(() => {
    if (!get("date") && !get("start_date") && !get("end_date")) {
      set({ date: defaultDateStr });
    }
  }, []);

  const therapistType = get("therapist_type", "both") as
    | "internal"
    | "external"
    | "both";
  const page = parseInt(get("page", "1"), 10);
  const limit = parseInt(get("limit", "10"), 10);

  const [data, setData] = useState<ReminderDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Debounce for patient_name
  const [localPatientName, setLocalPatientName] = useState(patientNameStr);

  useEffect(() => {
    setLocalPatientName(patientNameStr);
  }, [patientNameStr]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localPatientName !== patientNameStr) {
        set({ patient_name: localPatientName, page: "1" });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localPatientName, set, patientNameStr]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchReminderData({
          date: dateStr,
          start_date: startDateStr,
          end_date: endDateStr,
          patient_name: patientNameStr,
          therapist_type: therapistType,
          page,
          limit,
        });
        if (res?.items) {
          setData(res.items);
        } else {
          setData([]);
        }

        if (res?.meta) {
          setTotalPages(res.meta.total_pages || 1);
          setTotalItems(
            res.meta.total || res.meta.total_items || res.items?.length || 0,
          );
        }
      } catch (err) {
        console.error("Failed to fetch reminders:", err);
        toast.error("Failed to load reminders data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [dateStr, startDateStr, endDateStr, patientNameStr, therapistType, page, limit]);

  const handleExportAll = async (
    onProgress?: (loaded: number, total: number) => void,
  ) => {
    return fetchAllPages(
      fetchReminderData,
      {
        date: dateStr,
        start_date: startDateStr,
        end_date: endDateStr,
        patient_name: patientNameStr,
        therapist_type: therapistType,
      },
      "items",
      onProgress,
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#6200EE]">
            Reminders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Export and preview therapist appointment reminders
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Date
          </label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) =>
              set({
                date: e.target.value,
                start_date: null,
                end_date: null,
                page: "1",
              })
            }
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Start Date
          </label>
          <input
            type="date"
            value={startDateStr}
            onChange={(e) => set({ start_date: e.target.value, date: null, page: "1" })}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            End Date
          </label>
          <input
            type="date"
            value={endDateStr}
            onChange={(e) => set({ end_date: e.target.value, date: null, page: "1" })}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Patient Name
          </label>
          <input
            type="text"
            placeholder="Search patient..."
            value={localPatientName}
            onChange={(e) => setLocalPatientName(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition w-48"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Therapist Type
          </label>
          <select
            value={therapistType}
            onChange={(e) => set({ therapist_type: e.target.value, page: "1" })}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition"
          >
            <option value="both">Both</option>
            <option value="internal">Internal</option>
            <option value="external">External (Mitra)</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">
            Reminder Data Preview
          </h2>
          <ExportExcelButton
            data={data}
            fileName={`Reminders_${dateStr}`}
            onFetchAll={handleExportAll}
            onCustomExport={exportRemindersCustom}
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                {[
                  "Therapist Name",
                  "Email",
                  "Type",
                  "Patient Name",
                  "Status",
                  "Appointment Time",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 py-3 px-5 bg-slate-50/70"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-slate-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j} className="py-3.5 px-5">
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-40 text-center text-sm text-slate-400"
                  >
                    No reminders found for the selected date and filters.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, i) => (
                  <TableRow
                    key={i}
                    className={`group border-b border-slate-50 hover:bg-violet-50/40 transition-colors ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}
                  >
                    <TableCell className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xs font-bold text-[#6200EE]">
                          {(item.therapist_name || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-800">
                          {item.therapist_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-5 text-sm text-slate-600">
                      {item.therapist_email || "—"}
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          item.therapist_type === "internal"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.therapist_type}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 px-5 text-sm font-medium text-slate-700">
                      {item.patient_name || "—"}
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          item.status === "SCHEDULED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "CANCELLED"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 px-5 text-sm text-slate-600">
                      {item.appt_date_time_wib
                        ? format(
                            new Date(
                              item.appt_date_time_wib.replace(
                                /(Z|[+-]\d{2}:?\d{2})$/i,
                                ""
                              )
                            ),
                            "PPP p"
                          )
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs text-slate-400">
              Page <span className="font-semibold text-slate-700">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">{totalPages}</span>{" "}
              • Total{" "}
              <span className="font-semibold text-slate-700">{totalItems}</span>{" "}
              items
            </p>
            <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Show
              </span>
              <select
                value={limit}
                onChange={(e) => set({ limit: e.target.value, page: "1" })}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-400 transition text-slate-700 cursor-pointer"
              >
                {[10, 25, 50, 100, 500, 1000].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => set({ page: String(page - 1) })}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <button
              onClick={() => set({ page: String(page + 1) })}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RemindersPage() {
  return (
    <Suspense>
      <RemindersPageInner />
    </Suspense>
  );
}
