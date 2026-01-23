"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

const data = [
    { name: "Completed", value: 41 },
    { name: "Remaining", value: 59 },
];

export function ProjectProgress() {
    return (
        <Card className="rounded-3xl border-none shadow-sm bg-white">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Project Progress</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
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
                            <Cell key="cell-0" fill="#105D3B" /> {/* Dark Green */}
                            <Cell key="cell-1" fill="#e2e8f0" /> {/* Slate 200 */}
                            <Label
                                value="41%"
                                position="center"
                                className="text-3xl font-bold fill-foreground"
                                dy={-10}
                            />
                            <Label
                                value="Project Ended"
                                position="center"
                                className="text-xs fill-muted-foreground/60"
                                dy={15}
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="flex items-center justify-center gap-6 mt-[-40px]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#105D3B]" />
                        <span className="text-xs text-muted-foreground">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <span className="text-xs text-muted-foreground">Pending</span>
                        {/* Mockup shows striped pattern for pending/remaining, usually hard to do in Legend dots, defaulting to solid */}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
