"use client";

import { Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useOrders } from "@/lib/hooks/use-orders";
import { useFilterParams } from "@/lib/hooks/use-filter-params";
import { OrderFilterBar } from "@/components/sections/orders/order-filter-bar";
import { OrderStatusBadge } from "@/components/sections/orders/status-badge";
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

function OrdersPageInner() {
  const {
    orders,
    loading,
    page,
    pageSize,
    totalPages,
    totalItems,
    handleExportAll,
  } = useOrders();
  const { set } = useFilterParams();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#6200EE]">
          Order Status
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage and track all customer orders
        </p>
      </div>

      {/* Filter Bar */}
      <OrderFilterBar />

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">Orders List</h2>
          {/* <ExportExcelButton
            data={orders}
            fileName="Orders"
            onFetchAll={handleExportAll}
          /> */}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                {[
                  "Order ID",
                  "Customer",
                  "Service",
                  "Package",
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
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-40 text-center text-sm text-slate-400"
                  >
                    No orders found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, i) => (
                  <TableRow
                    key={order.id}
                    className={`group border-b border-slate-50 hover:bg-violet-50/40 transition-colors ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}
                  >
                    <TableCell className="py-3.5 px-5 font-mono text-xs font-semibold text-violet-700">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {order.registration_number || order.id?.slice(0, 8)}
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xs font-bold text-[#6200EE]">
                          {(order.patient?.name || order.user?.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-800">
                          {order.patient?.name ||
                            order.user?.email ||
                            "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-xs font-medium">
                        {order.service?.name?.replace(/_/g, " ") || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 px-5 text-sm text-slate-600">
                      {order.package?.name || "—"}
                    </TableCell>
                    <TableCell className="py-3.5 px-5 text-sm text-slate-500">
                      {order.created_at
                        ? format(new Date(order.created_at), "PPP")
                        : "—"}
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="py-3.5 px-5 text-right">
                      <Link href={`/dashboard/orders/${order.id}`}>
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Page <span className="font-semibold text-slate-700">{page}</span> of{" "}
            <span className="font-semibold text-slate-700">{totalPages}</span> •
            Total{" "}
            <span className="font-semibold text-slate-700">{totalItems}</span>{" "}
            items
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => set({ page: String(page - 1) })}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <button
              onClick={() => set({ page: String(page + 1) })}
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

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersPageInner />
    </Suspense>
  );
}
