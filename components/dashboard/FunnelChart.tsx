"use client";

import { Bar, BarChart, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FunnelData {
    users: number;
    registrations: number;
    bookings_started: number;
    bookings_completed: number;
    payments_success: number;
}

export function FunnelChart({ data }: { data?: FunnelData }) {
    if (!data) return null;

    const chartData = [
        { name: "Users", value: data.users, fill: "#94a3b8" },
        { name: "Registered", value: data.registrations, fill: "#6200EE" },
        { name: "Booking Start", value: data.bookings_started, fill: "#7C3AED" },
        { name: "Booking Done", value: data.bookings_completed, fill: "#8B5CF6" },
        { name: "Paid", value: data.payments_success, fill: "#A78BFA" },
    ];

    // Calculate drops
    const regDrop = ((data.users - data.registrations) / data.users) * 100;
    const showAlert = regDrop > 20;

    return (
        <Card className="rounded-3xl border-none shadow-sm xl:col-span-2 bg-white h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Funnel Monitoring (Daily)</CardTitle>
                    {showAlert && (
                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            ⚠️ Drop {regDrop.toFixed(0)}% at Register
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barSize={60}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.4} />
                                </linearGradient>
                                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6200EE" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#6200EE" stopOpacity={0.4} />
                                </linearGradient>
                                <linearGradient id="colorBook" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.4} />
                                </linearGradient>
                                <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.4} />
                                </linearGradient>
                                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.4} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                                dy={10}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc', opacity: 0.6 }}
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                                    padding: '12px 16px',
                                    backgroundColor: 'white'
                                }}
                                itemStyle={{ fontWeight: 600, color: '#334155' }}
                            />
                            <Bar dataKey="value" radius={[12, 12, 12, 12]}>
                                {chartData.map((entry, index) => {
                                    // Map index to gradient ID
                                    let fillId = "colorUsers";
                                    if (index === 1) fillId = "colorReg";
                                    if (index === 2) fillId = "colorBook";
                                    if (index === 3) fillId = "colorDone";
                                    if (index === 4) fillId = "colorPaid";

                                    return <Cell key={`cell-${index}`} fill={`url(#${fillId})`} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
