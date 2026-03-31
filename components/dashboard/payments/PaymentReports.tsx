"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPaymentReport } from "@/lib/api/dashboard";
import type { PaymentReport } from "@/lib/api/types";

type View = "monthly" | "weekly";

export function PaymentReports() {
  const [view, setView] = useState<View>("monthly");
  const [year, setYear] = useState<string>("all");
  const [month, setMonth] = useState<string>("all");
  const [data, setData] = useState<PaymentReport | null>(null);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2023 },
    (_, i) => currentYear - i,
  );
  const availableMonths = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2000, i, 1).toLocaleString("en", { month: "long" }),
  }));

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params: Parameters<typeof fetchPaymentReport>[0] = { view };
        if (year !== "all") params.year = Number(year);
        if (view === "weekly" && month !== "all") params.month = Number(month);
        const res = await fetchPaymentReport(params);
        setData(res);
      } catch (e) {
        console.error("Failed to load payment report", e);
        toast.error("Failed to load payment report. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [view, year, month]);

  const chartData =
    data?.trend.map((t) => ({
      label: t.label,
      revenue: t.by_status["PAID"] ?? 0,
    })) ?? [];

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setView("monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              view === "monthly"
                ? "bg-white text-[#6200EE] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setView("weekly")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              view === "weekly"
                ? "bg-white text-[#6200EE] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Weekly
          </button>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-slate-700"
        >
          <option value="all">All Years</option>
          {availableYears.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>

        {view === "weekly" && (
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-slate-700"
          >
            <option value="all">All Months</option>
            {availableMonths.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Summary cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-linear-to-br from-[#6200EE] to-[#8B5CF6] rounded-2xl p-6 text-white flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-purple-100 text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Total Revenue
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {(data?.total.combined_revenue ?? 0).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </p>
              <p className="text-purple-100 text-xs">
                {data?.total.combined_orders ?? 0} transactions
              </p>
            </div>
            <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
              <ArrowUpRight className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Avg. per Period
            </p>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {(
                  data?.total.avg_revenue_per_period["PAID"] ?? 0
                ).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Based on {data?.trend.length ?? 0} periods
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#6200EE]" />
          <h3 className="text-sm font-semibold text-slate-800">
            Revenue Trend
          </h3>
        </div>
        <div className="p-6">
          {loading ? (
            <Skeleton className="h-75 w-full rounded-xl" />
          ) : chartData.length === 0 ? (
            <div className="h-75 flex items-center justify-center text-sm text-slate-400">
              No data available for this period.
            </div>
          ) : (
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#64748B", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                  />
                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                  />
                  <Tooltip
                    cursor={{ fill: "#F1F5F9" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: any) => [
                      value?.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }),
                      "Revenue",
                    ]}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill="#6200EE" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-[#6200EE]" />
          <h3 className="text-sm font-semibold text-slate-800">
            Detailed Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  "Period",
                  "Orders",
                  "Revenue",
                  "Avg Order Value",
                  "Discount",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 py-3 px-6 bg-slate-50/70"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="py-3.5 px-6">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (data?.breakdown ?? []).length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    No data available.
                  </td>
                </tr>
              ) : (
                [...(data?.breakdown ?? [])].reverse().map((row, i) => {
                  const paid = row.by_status["PAID"];
                  return (
                    <tr
                      key={i}
                      className={`hover:bg-violet-50/30 transition-colors ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}
                    >
                      <td className="py-3.5 px-6 font-medium text-slate-800">
                        {row.label}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600">
                        {paid?.total_orders ?? 0}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-[#6200EE]">
                        {(paid?.revenue ?? 0).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600">
                        {(paid?.avg_order_value ?? 0).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">
                        {(paid?.discount_amount ?? 0).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
