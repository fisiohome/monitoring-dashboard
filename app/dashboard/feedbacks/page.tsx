"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, ChevronDown, Search } from "lucide-react";

import { useFeedbacks } from "@/lib/hooks/use-feedbacks";
import { useFilterParams } from "@/lib/hooks/use-filter-params";
import { CopyButton } from "@/components/ui/copy-button";
import { FeedbackFilterBar } from "@/components/sections/feedbacks/feedback-filter-bar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";
import * as xlsx from "xlsx";
import { FeedbackDashboard } from "@/components/sections/feedbacks/feedback-dashboard";

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-amber-600">{Number(rating || 0).toFixed(1)}</span>
    </div>
  );
}

function FeedbacksPageInner() {
  const {
    feedbacks,
    loading,
    page,
    limit,
    totalPages,
    totalItems,
    hasActiveFilters,
    setFilters,
    clearFilters,
  } = useFeedbacks();
  const { get } = useFilterParams();
  const [activeTab, setActiveTab] = useState<"overview" | "list">("overview");

  const handleExport = (type: "excel" | "csv") => {
    try {
      if (!feedbacks.length) {
        toast.error("No data to export");
        return;
      }
      const data = feedbacks.map((fb) => ({
        "Review Date": fb.created_at ? fb.created_at.split("T")[0] : "",
        "Reg No": fb.registration_number,
        "Patient Name": fb.patient_name,
        "Therapist Name": fb.therapist_name,
        "Communication": fb.communication_rating,
        "Service": fb.service_rating,
        "Effectiveness": fb.effectiveness_rating,
        "Appearance": fb.appearance_rating,
        "Average Score": fb.average_rating,
        "Comment": (fb as any).comment || fb.order?.special_notes || "",
        "Duration": fb.service_duration_sufficient,
      }));
      const ws = xlsx.utils.json_to_sheet(data);
      if (type === "csv") {
        const csv = xlsx.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "Feedbacks_Export.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "Feedbacks");
        xlsx.writeFile(wb, "Feedbacks_Export.xlsx");
      }
      toast.success(`${type.toUpperCase()} Export successful!`);
    } catch (e: any) {
      toast.error("Export failed", { description: e.message });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#6200EE]">
          Feedbacks
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Monitor and analyze patient feedbacks
        </p>
      </div>

      <FeedbackFilterBar />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 mt-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors duration-200 ${
            activeTab === "overview"
              ? "border-violet-600 text-violet-700"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          Visual Overview
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors duration-200 ${
            activeTab === "list"
              ? "border-violet-600 text-violet-700"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          Tabel Detail Review
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <FeedbackDashboard />
        </div>
      )}

      {activeTab === "list" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Table header bar */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 flex-wrap gap-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Feedbacks List
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by ID or Patient..."
                  value={get("patient_name") || get("registration_number") || ""}
                  onChange={(e) => {
                      setFilters({ 
                          patient_name: e.target.value,
                          registration_number: e.target.value 
                      });
                  }}
                  className="pl-9 pr-4 py-1.5 h-9 text-[13px] bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-400 transition w-64"
                />
              </div>
              <div className="relative group">
                <button
                  className="h-9 px-4 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-100/50 rounded-xl transition-colors flex items-center gap-2"
                >
                  Export <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
                   <button onClick={() => handleExport("excel")} className="w-full text-left px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors">Excel (.xlsx)</button>
                   <button onClick={() => handleExport("csv")} className="w-full text-left px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors">CSV (.csv)</button>
                </div>
              </div>
            </div>
          </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                {[
                  { key: "created_at", label: "Review Date" },
                  { key: "registration_number", label: "Reg No" },
                  { key: "patient_name", label: "Patient" },
                  { key: "therapist_name", label: "Therapist" },
                  { key: "communication_rating", label: "Comm." },
                  { key: "service_rating", label: "Service" },
                  { key: "effectiveness_rating", label: "Effec." },
                  { key: "appearance_rating", label: "Appea." },
                  { key: "average_rating", label: "Avg" },
                  { key: "comment", label: "Comment" },
                  { key: "service_duration_sufficient", label: "Duration" },
                ].map((col) => (
                  <TableHead
                    key={col.label}
                    className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 py-3 px-5 bg-slate-50/70 cursor-pointer hover:bg-slate-100/70 hover:text-slate-600 transition"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-slate-50">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <TableCell key={j} className="py-3.5 px-5">
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : feedbacks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-40 text-center text-sm text-slate-400"
                  >
                    No feedbacks found.{" "}
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="underline text-violet-600 hover:text-violet-700"
                      >
                        Clear filters
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks.map((fb, i) => (
                  <TableRow
                    key={fb.id}
                    className={`group border-b border-slate-50 hover:bg-violet-50/40 transition-colors ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}
                  >
                     <TableCell className="py-3.5 px-5 text-xs text-slate-500 whitespace-nowrap">
                      {fb.created_at ? fb.created_at.split("T")[0] : "-"}
                    </TableCell>
                    <TableCell className="py-3.5 px-5 font-mono text-xs font-semibold text-violet-700">
                      <div className="flex items-center justify-between group/copy">
                        <span>{fb.registration_number}</span>
                        <CopyButton
                          value={fb.registration_number}
                          className="opacity-0 group-hover/copy:opacity-100 transition-opacity"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <p className="text-sm font-medium text-slate-800 leading-tight">
                        {fb.patient_name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {fb.patient_phone}
                      </p>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <p className="text-sm font-medium text-slate-800 leading-tight">
                        {fb.therapist_name}
                      </p>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <RatingStars rating={fb.communication_rating} />
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <RatingStars rating={fb.service_rating} />
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <RatingStars rating={fb.effectiveness_rating} />
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <RatingStars rating={fb.appearance_rating} />
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <div className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-500" />
                        <span className="text-xs font-bold">{Number(fb.average_rating || 0).toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <p className="text-xs text-slate-500 line-clamp-2 max-w-[150px]" title={(fb as any).comment || fb.order?.special_notes || "-"}>
                        {(fb as any).comment || fb.order?.special_notes || "-"}
                      </p>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${fb.service_duration_sufficient === "Sufficient" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                        {fb.service_duration_sufficient}
                      </span>
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
                onChange={(e) =>
                  setFilters({ limit: e.target.value, page: "1" })
                }
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-400 transition text-slate-700 cursor-pointer"
              >
                {[10, 50, 100, 200, 500, 1000].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilters({ page: String(page - 1) })}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <button
              onClick={() => setFilters({ page: String(page + 1) })}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

export default function FeedbacksPage() {
  return (
    <Suspense>
      <FeedbacksPageInner />
    </Suspense>
  );
}
