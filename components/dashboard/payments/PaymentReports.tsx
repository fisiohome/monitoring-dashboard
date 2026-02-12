"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, getWeek, startOfWeek, endOfWeek, parseISO, isValid } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Calendar, DollarSign, Filter } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PaymentReportsProps {
    payments: any[];
}

type Period = "WEEKLY" | "MONTHLY";

export function PaymentReports({ payments }: PaymentReportsProps) {
    const [period, setPeriod] = useState<Period>("MONTHLY");
    const [selectedYear, setSelectedYear] = useState<string>("ALL");
    const [selectedMonth, setSelectedMonth] = useState<string>("ALL");

    // Extract available years from data + default range
    const availableYears = useMemo(() => {
        const years = new Set<string>();
        const currentYear = new Date().getFullYear();

        // Add default range (Current Year down to 2024)
        for (let y = currentYear; y >= 2024; y--) {
            years.add(y.toString());
        }

        // Add years from actual data
        payments.forEach(p => {
            const dateStr = p.created_at || p.date;
            if (dateStr) {
                const date = parseISO(dateStr);
                if (isValid(date)) {
                    years.add(format(date, "yyyy"));
                }
            }
        });

        return Array.from(years).sort().reverse();
    }, [payments]);

    const aggregatedData = useMemo(() => {
        const data: Record<string, { label: string; amount: number; count: number; date: Date }> = {};

        payments.forEach((payment) => {
            // Only consider paid/success payments
            const status = payment.payment_status || payment.status || "";
            if (!["PAID", "SUCCESS", "COMPLETED"].includes(status)) return;

            const dateStr = payment.created_at || payment.date;
            if (!dateStr) return;

            const date = parseISO(dateStr);
            if (!isValid(date)) return;

            // Apply Filters
            const year = format(date, "yyyy");
            if (selectedYear !== "ALL" && year !== selectedYear) return;

            if (period === "WEEKLY" && selectedMonth !== "ALL") {
                const month = format(date, "M"); // 1-12
                if (month !== selectedMonth) return;
            }

            let key = "";
            let label = "";

            if (period === "MONTHLY") {
                key = format(date, "yyyy-MM");
                label = format(date, "MMMM yyyy");
            } else {
                const week = getWeek(date);
                const year = format(date, "yyyy");
                key = `${year}-W${week}`;
                const start = startOfWeek(date);
                const end = endOfWeek(date);
                label = `Week ${week}, ${year} (${format(start, "d MMM")} - ${format(end, "d MMM")})`;
            }

            const amount = payment.total_amount || payment.total_price || 0;

            if (!data[key]) {
                data[key] = { label, amount: 0, count: 0, date };
            }

            data[key].amount += amount;
            data[key].count += 1;
        });

        return Object.values(data).sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [payments, period, selectedYear, selectedMonth]);

    const totalIncome = aggregatedData.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Controls */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setPeriod("MONTHLY")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${period === "MONTHLY"
                            ? "bg-white text-[#6200EE] shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setPeriod("WEEKLY")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${period === "WEEKLY"
                            ? "bg-white text-[#6200EE] shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Weekly
                    </button>
                </div>


                <div className="flex flex-wrap gap-3">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[130px] h-10 bg-white border border-slate-200 rounded-xl focus:ring-[#6200EE] focus:ring-offset-0 text-slate-700 font-medium shadow-sm hover:bg-slate-50 transition-colors">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-100 shadow-xl rounded-xl">
                            <SelectItem value="ALL" className="focus:bg-[#6200EE] focus:text-white cursor-pointer rounded-lg m-1">All Years</SelectItem>
                            {availableYears.map(year => (
                                <SelectItem key={year} value={year} className="focus:bg-[#6200EE] focus:text-white cursor-pointer rounded-lg m-1">{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {period === "WEEKLY" && (
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[150px] h-10 bg-white border border-slate-200 rounded-xl focus:ring-[#6200EE] focus:ring-offset-0 text-slate-700 font-medium shadow-sm hover:bg-slate-50 transition-colors">
                                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] bg-white border border-slate-100 shadow-xl rounded-xl">
                                <SelectItem value="ALL" className="focus:bg-[#6200EE] focus:text-white cursor-pointer rounded-lg m-1">All Months</SelectItem>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                    <SelectItem key={month} value={month.toString()} className="focus:bg-[#6200EE] focus:text-white cursor-pointer rounded-lg m-1">
                                        {format(new Date(2000, month - 1, 1), "MMMM")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            {/* Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-3 border-none shadow-sm rounded-3xl bg-gradient-to-br from-[#6200EE] to-[#8B5CF6] text-white">
                    <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-purple-100 font-medium flex items-center gap-2">
                                <DollarSign className="h-5 w-5 bg-white/20 rounded-full p-1" />
                                Total Income ({period === "MONTHLY" ? "All Time" : "All Time"})
                            </p>
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                                {totalIncome.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </h2>
                            <p className="text-purple-100 text-sm">
                                Based on {aggregatedData.length} {period.toLowerCase()} periods
                            </p>
                        </div>
                        <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <ArrowUpRight className="h-8 w-8 text-white" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Section */}
            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#6200EE]" />
                        Income Trends
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={aggregatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F1F5F9' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [value?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }), "Income"]}
                                />
                                <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={50}>
                                    {aggregatedData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#6200EE" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Table */}
            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-lg font-bold text-slate-800">
                        Detailed Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Period</th>
                                    <th className="px-6 py-4 text-center">Transactions</th>
                                    <th className="px-6 py-4 text-right">Total Income</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {aggregatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                                            No data available for this period.
                                        </td>
                                    </tr>
                                ) : (
                                    aggregatedData.slice().reverse().map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {item.label}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                                    {item.count} Orders
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-[#6200EE]">
                                                {item.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
