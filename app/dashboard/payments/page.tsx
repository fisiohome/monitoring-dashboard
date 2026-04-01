"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, BarChart2, List, Download } from "lucide-react";

import { usePayments } from "@/lib/hooks/use-payments";
import { useFilterParams } from "@/lib/hooks/use-filter-params";
import { CopyButton } from "@/components/ui/copy-button";
import { PaymentFilterBar } from "@/components/sections/payments/payment-filter-bar";
import { PaymentStatusBadge } from "@/components/sections/payments/status-badge";
import { PaymentReports } from "@/components/dashboard/payments/PaymentReports";
import { PaymentExport } from "@/components/dashboard/payments/PaymentExport";
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

function PaymentsPageInner() {
  const {
    payments,
    loading,
    page,
    limit,
    totalPages,
    totalItems,
    handleExportAll,
  } = usePayments();
  const { set } = useFilterParams();
  const [viewMode, setViewMode] = useState<"LIST" | "REPORTS" | "EXPORT">("LIST");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#6200EE]">
            Payments
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track and manage all payment transactions
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode("LIST")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === "LIST"
                ? "bg-white text-[#6200EE] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <List className="h-4 w-4" /> List
          </button>
          <button
            onClick={() => setViewMode("REPORTS")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === "REPORTS"
                ? "bg-white text-[#6200EE] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <BarChart2 className="h-4 w-4" /> Reports
          </button>
          <button
            onClick={() => setViewMode("EXPORT")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === "EXPORT"
                ? "bg-white text-[#6200EE] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {viewMode === "EXPORT" ? (
        <PaymentExport />
      ) : viewMode === "REPORTS" ? (
        <PaymentReports />
      ) : (
        <>
          <PaymentFilterBar />

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">
                Transaction History
              </h2>
              <ExportExcelButton
                data={payments}
                fileName="Payments"
                onFetchAll={handleExportAll}
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 hover:bg-transparent">
                    {[
                      "Order ID",
                      "Customer",
                      "Amount",
                      "Date",
                      "Status",
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
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j} className="py-3.5 px-5">
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : payments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-40 text-center text-sm text-slate-400"
                      >
                        No payments found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((p, i) => (
                      <TableRow
                        key={p.id}
                        className={`group border-b border-slate-50 hover:bg-violet-50/40 transition-colors ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}
                      >
                        <TableCell className="py-3.5 px-5 font-mono text-xs font-semibold text-violet-700">
                          <div className="flex items-center justify-between group/copy">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <span>
                                {p.registration_number || p.id?.slice(0, 8)}
                              </span>
                            </div>
                            <CopyButton
                              value={p.registration_number || p.id}
                              className="opacity-0 group-hover/copy:opacity-100 transition-opacity"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xs font-bold text-[#6200EE]">
                              {(p.patient?.name || p.user?.email || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-800">
                              {p.patient?.name || p.user?.email || "Unknown"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 px-5 text-sm font-semibold text-slate-800">
                          {(
                            p.total_amount ||
                            p.total_price ||
                            0
                          ).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })}
                        </TableCell>
                        <TableCell className="py-3.5 px-5 text-sm text-slate-500">
                          {p.created_at
                            ? format(new Date(p.created_at), "PPP")
                            : "—"}
                        </TableCell>
                        <TableCell className="py-3.5 px-5">
                          <PaymentStatusBadge status={p.payment_status} />
                        </TableCell>
                        <TableCell className="py-3.5 px-5 text-right">
                          <Link href={`/dashboard/payments/${p.id}`}>
                            <button className="text-xs text-slate-400 hover:text-violet-600 font-medium transition-colors opacity-0 group-hover:opacity-100">
                              View →
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
                  Page{" "}
                  <span className="font-semibold text-slate-700">{page}</span> of{" "}
                  <span className="font-semibold text-slate-700">
                    {totalPages}
                  </span>{" "}
                  • Total{" "}
                  <span className="font-semibold text-slate-700">
                    {totalItems}
                  </span>{" "}
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
        </>
      )}
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense>
      <PaymentsPageInner />
    </Suspense>
  );
}
