"use client";

import { useState } from "react";
import { format, subMonths } from "date-fns";
import { Download, FileSpreadsheet } from "lucide-react";
import { exportOrdersReport } from "@/lib/api/orders";

export function PaymentExport() {
  const [loading, setLoading] = useState(false);
  const [creatorType, setCreatorType] = useState<"admin" | "customer" | "">("customer");
  
  // Default: 1 month ago to now
  const [startDate, setStartDate] = useState<string>(
    format(subMonths(new Date(), 1), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  const handleExport = async () => {
    try {
      setLoading(true);
      
      const startIso = startDate ? new Date(`${startDate}T00:00:00+07:00`).toISOString() : undefined;
      const endIso = endDate ? new Date(`${endDate}T23:59:59+07:00`).toISOString() : undefined;

      const blob = await exportOrdersReport({
        creator_type: creatorType,
        order_start_date: startIso,
        order_end_date: endIso,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const datetime = format(new Date(), "yyyyMMdd-HHmmss");
      a.download = `SalesInvoiceImportTemplate-${datetime}.xlsx`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error("Export failed:", error);
      alert(`Failed to export report: ${error.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="h-10 w-10 bg-violet-100 rounded-xl flex items-center justify-center">
          <FileSpreadsheet className="h-5 w-5 text-[#6200EE]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">Export Report</h2>
          <p className="text-sm text-slate-500">Download Excel reports for paid orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Creator Type</label>
          <select
            value={creatorType}
            onChange={(e) => setCreatorType(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-slate-700"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="">All</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-slate-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-slate-700"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={handleExport}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6200EE] text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Generate Export
        </button>
      </div>
    </div>
  );
}
