"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

interface AutoAssignData {
    total: number;
    success: number;
    failed: number;
}

export function AutoAssignWidget({ data }: { data?: AutoAssignData }) {
    const successRate = data ? Math.round((data.success / data.total) * 100) : 0;
    const isCritical = successRate < 80;

    const chartData = [
        { name: "Success", value: data?.success || 0, fill: "url(#pieSuccess)" },
        { name: "Failed", value: data?.failed || 0, fill: "#f1f5f9" },
    ];

    const gradientId = isCritical ? "pieCritical" : "pieSuccess";
    // Update data fill based on status
    chartData[0].fill = `url(#${gradientId})`;

    return (
        <Card className="rounded-3xl border-none shadow-sm bg-white h-full relative overflow-hidden">
            {/* Decorative Background Blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -z-10" />

            <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">Auto-Assign Perf</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            <linearGradient id="pieSuccess" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6200EE" />
                                <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                            <linearGradient id="pieCritical" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="100%" stopColor="#f87171" />
                            </linearGradient>
                        </defs>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={10}
                        >
                            <Cell key="cell-success" fill={chartData[0].fill} />
                            <Cell key="cell-failed" fill="#f1f5f9" />
                            <Label
                                value={`${successRate}%`}
                                position="center"
                                className={`text-3xl font-bold ${isCritical ? "fill-red-600" : "fill-foreground"}`}
                                dy={-10}
                            />
                            <Label
                                value="Success Rate"
                                position="center"
                                className="text-xs fill-muted-foreground/60"
                                dy={15}
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {isCritical && (
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                            ⚠️ Eskalasi Needed
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
