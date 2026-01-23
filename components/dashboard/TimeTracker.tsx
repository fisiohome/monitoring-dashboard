"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TimeTracker() {
    return (
        <Card className="rounded-3xl border-none shadow-sm bg-[#1a1a1a] text-white relative overflow-hidden h-full">
            {/* Background Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="#105D3B" />
                    <path d="M0,60 Q25,40 50,60 T100,60 V100 H0 Z" fill="#166542" />
                </svg>
            </div>

            <CardHeader className="relative z-10 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Time Tracker</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="text-4xl font-light tracking-wider font-mono">
                        01:24:08
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                        <Button size="icon" className="rounded-full w-10 h-10 bg-white hover:bg-slate-200 text-black">
                            <Pause className="w-4 h-4 fill-black" />
                        </Button>
                        <Button size="icon" className="rounded-full w-10 h-10 bg-red-500 hover:bg-red-600 text-white border-2 border-red-500">
                            <Square className="w-4 h-4 fill-white" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
