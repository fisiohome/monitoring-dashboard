"use client";

import { fetchAllPages } from "@/lib/export-utils";
import { ExportExcelButton } from "@/components/ui/ExportExcelButton";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { fetchOrders } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [creatorTypeFilter, setCreatorTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        page_size: pageSize,
      };

      if (statusFilter !== "ALL") {
        params.status = statusFilter;
      }
      if (creatorTypeFilter !== "") {
        params.creator_type = creatorTypeFilter;
      }

      const res = await fetchOrders(params);
      const bookings = Array.isArray(res) ? res : res.bookings || [];
      const total =
        res.meta?.total ||
        res.meta?.total_items ||
        res.total ||
        (Array.isArray(res) ? res.length : 0);

      // Client-side filtering as fallback/enhancement
      let filtered = bookings;
      if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        filtered = bookings.filter(
          (b: any) =>
            (b.customer?.full_name || b.patient?.name || "")
              .toLowerCase()
              .includes(lower) ||
            (b.id || "").toLowerCase().includes(lower) ||
            (b.registration_number || "").toLowerCase().includes(lower),
        );
      }

      setOrders(filtered);
      setTotalItems(total);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter, creatorTypeFilter, searchQuery]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadOrders();
    }, 500);
    return () => clearTimeout(debounce);
  }, [loadOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const handleExportAll = async () => {
    const params: any = {};
    if (statusFilter !== "ALL") {
      params.status = statusFilter;
    }
    if (creatorTypeFilter !== "") {
      params.creator_type = creatorTypeFilter;
    }
    return await fetchAllPages(fetchOrders, params, "bookings");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#6200EE]">
          Order Status
        </h1>
      </div>

      {/* Filter Card */}
      <Card className="border-none shadow-sm rounded-3xl bg-white/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by Order ID or Customer..."
                className="pl-10 bg-white border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={creatorTypeFilter}
                onChange={(e) => setCreatorTypeFilter(e.target.value)}
              >
                <option value="">All Creator Types</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            <div className="w-full md:w-[200px]">
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING_PAYMENT">Pending Payment</option>
                {/* <option value="PARTIALLY_PAID">Partially Paid</option> */}
                {/* <option value="PAID">Paid</option> */}
                <option value="SCHEDULED">Scheduled</option>
                {/* <option value="IN_PROGRESS">In Progress</option> */}
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                {/* <option value="REFUNDED">Refunded</option> */}
              </select>
            </div>
            <Button
              variant="outline"
              className="border-slate-200 bg-white"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setCreatorTypeFilter("");
                setPage(1);
              }}
            >
              <Filter className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-purple-100 px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle className="text-lg font-bold text-[#6200EE]">
            Orders List
          </CardTitle>
          <ExportExcelButton
            data={orders}
            fileName="Orders"
            onFetchAll={handleExportAll}
          />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 hover:bg-transparent">
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4 px-6">
                    Order ID
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">
                    Customer
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">
                    Service
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">
                    Date
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4 text-center">
                    Status
                  </TableHead>
                  <TableHead className="w-[80px] py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No orders found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      className={`group transition-all duration-200 border-b border-slate-100 hover:bg-purple-50/30 hover:shadow-sm ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      }`}
                    >
                      <TableCell
                        className="font-mono text-xs font-semibold text-[#6200EE] py-4 px-6 cursor-pointer"
                        onClick={() =>
                          (window.location.href = `/dashboard/orders/${order.id}`)
                        }
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6200EE] opacity-0 group-hover:opacity-100 transition-opacity" />
                          {order.registration_number || order.id.slice(0, 8)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xs font-bold text-[#6200EE]">
                            {(order.patient?.name || order.user?.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span>
                            {order.patient?.name ||
                              order.user?.email ||
                              "Unknown"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 py-4">
                        {order.service?.name || order.package?.name || "-"}
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm py-4">
                        {order.created_at
                          ? format(new Date(order.created_at), "PPP")
                          : "-"}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Badge
                          variant="secondary"
                          className={`font-semibold px-3 py-1 rounded-full text-xs
                                                        ${order.status.toLowerCase() === "completed" ? "bg-green-100 text-green-700" : ""}
                                                        ${order.status.toLowerCase() === "pending_payment" ? "bg-yellow-100 text-yellow-700" : ""}
                                                        ${order.status.toLowerCase() === "cancelled" ? "bg-red-100 text-red-700" : ""}
                                                        ${order.status.toLowerCase() === "confirmed" ? "bg-blue-100 text-blue-700" : ""}
                                                        ${!["completed", "pending_payment", "cancelled", "confirmed"].includes(order.status.toLowerCase()) ? "bg-slate-100 text-slate-700" : ""}
                                                    `}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-slate-500 hover:text-[#6200EE] hover:bg-purple-50 font-medium"
                          >
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-5 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="text-sm font-medium text-slate-600">
              Page <span className="font-bold text-[#6200EE]">{page}</span> of{" "}
              <span className="font-bold">
                {Math.ceil(totalItems / pageSize) || 1}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="rounded-xl border-slate-300 hover:bg-[#6200EE] hover:text-white hover:border-[#6200EE] transition-all"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={
                  page >= (Math.ceil(totalItems / pageSize) || 1) || loading
                }
                className="rounded-xl border-slate-300 hover:bg-[#6200EE] hover:text-white hover:border-[#6200EE] transition-all"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
