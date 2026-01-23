"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Layout, Database, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const projects = [
    {
        name: "Develop API Endpoints",
        date: "Due date: Nov 26, 2024",
        icon: Code2,
        color: "bg-blue-100 text-blue-600",
    },
    {
        name: "Onboarding Flow",
        date: "Due date: Nov 28, 2024",
        icon: Layout,
        color: "bg-teal-100 text-teal-600",
    },
    {
        name: "Build Dashboard",
        date: "Due date: Nov 30, 2024",
        icon: Database, // utilizing Database as generic 'build' icon
        color: "bg-green-100 text-green-600",
    },
    {
        name: "Optimize Page Load",
        date: "Due date: Dec 5, 2024",
        icon: Zap,
        color: "bg-orange-100 text-orange-600",
    },
    {
        name: "Cross-Browser Testing",
        date: "Due date: Dec 6, 2024",
        icon: Globe,
        color: "bg-purple-100 text-purple-600",
    },
];

export function ProjectList() {
    return (
        <Card className="rounded-3xl border-none shadow-sm bg-white h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Project</CardTitle>
                <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs border-slate-200">
                    + New
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {projects.map((project, index) => {
                        const Icon = project.icon;
                        return (
                            <div key={index} className="flex items-center gap-4">
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", project.color)}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold leading-none">{project.name}</h4>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        {project.date}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
