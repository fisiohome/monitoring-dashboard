"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import { useFeedbacks } from "@/lib/hooks/use-feedbacks";
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

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-amber-600">{rating.toFixed(1)}</span>
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

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">
            Feedbacks List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                {[
                  "Reg No",
                  "Patient",
                  "Therapist",
                  "Comm.",
                  "Service",
                  "Effec.",
                  "Appea.",
                  "Avg",
                  "Duration",
                  "",
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
                        <span className="text-xs font-bold">{fb.average_rating.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${fb.service_duration_sufficient === "Sufficient" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                        {fb.service_duration_sufficient}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 px-5 text-right">
                      <Link href={`/dashboard/orders/${fb.order_id}`}>
                        <button className="text-xs text-slate-400 hover:text-violet-600 font-medium transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap">
                          View Order →
                        </button>
                      </Link>
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
