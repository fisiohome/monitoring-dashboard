"use client";

import { fetchAllPages } from "@/lib/export-utils";
import { ExportExcelButton } from "@/components/ui/ExportExcelButton";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchPayments } from "@/lib/api";
import { PaymentReports } from "@/components/dashboard/payments/PaymentReports";
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
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Loader2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  List,
} from "lucide-react";
import { format } from "date-fns";

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<"LIST" | "REPORTS">("LIST");
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        page_size: pageSize,
      };

      if (statusFilter !== "ALL") {
        params.payment_status = statusFilter;
      }

      const res = await fetchPayments(params);
      const data = Array.isArray(res) ? res : res.bookings || [];
      const total =
        res.meta?.total ||
        res.meta?.total_items ||
        res.total ||
        (Array.isArray(res) ? res.length : 0);

      // Client-side filtering as fallback
      let filtered = data;
      if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        filtered = data.filter(
          (p: any) =>
            (p.patient?.name || p.user?.email || "")
              .toLowerCase()
              .includes(lower) ||
            (p.registration_number || p.id || "").toLowerCase().includes(lower),
        );
      }

      setPayments(filtered);
      setTotalItems(total);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter, searchQuery]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      load();
    }, 500);
    return () => clearTimeout(debounce);
  }, [load]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": // Fallthrough
      case "SUCCESS":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING": // Fallthrough
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      case "UNPAID":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const handleExportAll = async () => {
    const params: any = {};
    if (statusFilter !== "ALL") {
      params.status = statusFilter;
    }
    return await fetchAllPages(fetchPayments, params, "bookings");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#6200EE]">
          Payments
        </h1>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode("LIST")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === "LIST"
                ? "bg-white text-[#6200EE] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <List className="h-4 w-4" />
            List
          </button>
          <button
            onClick={async () => {
              setViewMode("REPORTS");
              if (allPayments.length === 0) {
                setLoadingReports(true);
                try {
                  // Fetch all payments for reports (using export logic to get all)
                  const allData = await fetchAllPages(
                    fetchPayments,
                    { payment_status: "PAID" },
                    "bookings",
                  );
                  setAllPayments(allData);
                } catch (e) {
                  console.error("Failed to load report data", e);
                } finally {
                  setLoadingReports(false);
                }
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === "REPORTS"
                ? "bg-white text-[#6200EE] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            Reports
          </button>
        </div>
      </div>

      {viewMode === "REPORTS" ? (
        loadingReports ? (
          <div className="flex h-[400px] w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#6200EE]" />
          </div>
        ) : (
          <PaymentReports payments={allPayments} />
        )
      ) : (
        <>
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PAID">Paid</option>
                    {/* <option value="PENDING_PAYMENT">Pending</option> */}
                    <option value="UNPAID">Unpaid</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                <Button
                  variant="outline"
                  className="border-slate-200 bg-white"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
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
                Transaction History
              </CardTitle>
              <ExportExcelButton
                data={payments}
                fileName="Payments"
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
                        Amount
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
                    ) : payments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-muted-foreground"
                        >
                          No payments found matching your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.map((p, index) => (
                        <TableRow
                          key={p.id}
                          className={`group transition-all duration-200 border-b border-slate-100 hover:bg-purple-50/30 hover:shadow-sm ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                          }`}
                        >
                          <TableCell className="font-mono text-xs font-semibold text-[#6200EE] py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#6200EE] opacity-0 group-hover:opacity-100 transition-opacity" />
                              {p.registration_number || p.id.slice(0, 8)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-slate-900 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xs font-bold text-[#6200EE]">
                                {(p.patient?.name || p.user?.email || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <span>
                                {p.patient?.name || p.user?.email || "Unknown"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-900 font-semibold py-4">
                            {p.total_amount
                              ? `Rp ${p.total_amount.toLocaleString("id-ID")}`
                              : p.total_price
                                ? `Rp ${p.total_price.toLocaleString("id-ID")}`
                                : "-"}
                          </TableCell>
                          <TableCell className="text-slate-600 text-sm py-4">
                            {p.created_at
                              ? format(new Date(p.created_at), "PPP")
                              : "-"}
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Badge
                              variant="outline"
                              className={`border-2 ${getStatusColor(p.payment_status || p.status)} font-semibold px-3 py-1 rounded-full text-xs`}
                            >
                              {p.payment_status || p.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 text-right pr-6">
                            <Link href={`/dashboard/payments/${p.id}`}>
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
                  Page <span className="font-bold text-[#6200EE]">{page}</span>{" "}
                  of{" "}
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
        </>
      )}
    </div>
  );
}
