"use client";

import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { name: "S", value: 30, active: false },
    { name: "M", value: 45, active: true },
    { name: "T", value: 25, active: false },
    { name: "W", value: 60, active: true }, // Highlighted in mockup looks like W or M
    { name: "T", value: 35, active: false },
    { name: "F", value: 45, active: false },
    { name: "S", value: 20, active: false },
];

export function ProjectAnalytics() {
    return (
        <Card className="rounded-3xl border-none shadow-sm xl:col-span-2 bg-white">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Project Analytics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={40}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                dy={10}
                            />
                            <Bar dataKey="value" radius={[20, 20, 20, 20]}>
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.active ? "#105D3B" : "url(#stripePattern)"}
                                        stroke={entry.active ? "none" : "#e2e8f0"} // weak border for striped?
                                        strokeWidth={entry.active ? 0 : 2}
                                    />
                                ))}
                            </Bar>
                            <defs>
                                <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                                    <rect width="2" height="4" transform="translate(0,0)" fill="#e2e8f0"></rect>
                                </pattern>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
