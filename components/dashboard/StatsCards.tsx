"use client";

import { ArrowUpRight, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
    data?: {
        orders: { total_today: number; success: number; stuck_count: number };
        payment: { pending_stuck_count: number };
    }
}

function StatsCard({ title, value, subtext, icon: Icon, variant = "default", alert = false }: any) {
    const isPrimary = variant === "primary";
    const isAlert = alert;

    return (
        <Card className={cn(
            "rounded-3xl border-none relative overflow-hidden h-[160px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
            isPrimary
                ? "bg-gradient-to-br from-[#6200EE] to-[#8B5CF6] text-white shadow-xl shadow-purple-500/20"
                : "bg-white text-card-foreground shadow-sm hover:shadow-md",
            isAlert && "border-l-4 border-l-red-500 bg-[#FFF5F5] ring-1 ring-red-100"
        )}>
            {/* Background decoration for primary card */}
            {isPrimary && (
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            )}

            <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                <div className="flex justify-between items-start">
                    <span className={cn("text-sm font-medium",
                        isPrimary ? "text-purple-100" : "text-slate-500",
                        isAlert && "text-red-600 font-semibold"
                    )}>
                        {title}
                    </span>
                    <div className={cn(
                        "rounded-2xl p-2.5 flex items-center justify-center w-10 h-10 transition-colors",
                        isPrimary ? "bg-white/20 backdrop-blur-sm text-white shadow-inner border border-white/10" : "bg-slate-50 text-slate-600",
                        isAlert && "bg-red-100 text-red-600"
                    )}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>

                <div className="mt-auto">
                    <h3 className={cn("text-3xl font-bold tracking-tight mb-2", isAlert && "text-red-700")}>{value}</h3>
                    <p className={cn("text-xs font-medium",
                        isPrimary ? "text-purple-200" : "text-slate-400",
                        isAlert && "text-red-500"
                    )}>
                        {subtext}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export function StatsCards({ data }: StatsCardsProps) {
    // Default values if data not loaded yet
    const orders = data?.orders || { total_today: 0, success: 0, stuck_count: 0 };
    const payment = data?.payment || { pending_stuck_count: 0 };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
                title="Total Orders Today"
                value={orders.total_today.toString()}
                subtext="Daily Volume"
                icon={ArrowUpRight}
                variant="primary"
            />
            <StatsCard
                title="Order Success"
                value={orders.success.toString()}
                subtext={`${orders.total_today > 0 ? Math.round((orders.success / orders.total_today) * 100) : 0}% rate`}
                icon={CheckCircle}
            />
            <StatsCard
                title="Stuck Orders (>30m)"
                value={orders.stuck_count.toString()}
                subtext="Action Required"
                icon={AlertCircle}
                alert={orders.stuck_count > 0}
            />
            <StatsCard
                title="Pending Payments (>30m)"
                value={payment.pending_stuck_count.toString()}
                subtext="Requires Follow Up"
                icon={Clock}
                alert={payment.pending_stuck_count > 0}
            />
        </div>
    );
}
