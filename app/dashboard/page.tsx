"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { FunnelChart } from "@/components/dashboard/FunnelChart";

import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { ActionableOrderTable } from "@/components/dashboard/ActionableOrderTable";
import { Button } from "@/components/ui/button";
import { fetchDashboardMetrics, fetchStuckOrders, DashboardMetrics, StuckOrder } from "@/lib/api";

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [stuckOrders, setStuckOrders] = useState<StuckOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const metricsData = await fetchDashboardMetrics();
                const ordersData = await fetchStuckOrders();
                setMetrics(metricsData);
                setStuckOrders(ordersData);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Operations Overview</h2>
                    <p className="text-muted-foreground mt-1">Real-time monitoring for CS & Ops Lead</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        Live updates: On
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content Area (Left 2 Columns) */}
                <div className="xl:col-span-2 space-y-8">
                    <StatsCards data={metrics ? { orders: metrics.orders, payment: metrics.payment, revenue: metrics.revenue } : undefined} />

                    {/* Charts Row */}
                    {/* Charts Row */}
                    <div className="w-full">
                        <FunnelChart data={metrics?.funnel} />
                    </div>
                </div>

                {/* Right Sidebar Area (Right 1 Column) */}
                <div className="space-y-8 flex flex-col">
                    <div className="flex-1 min-h-[400px]">
                        <ActionableOrderTable orders={stuckOrders} />
                    </div>
                </div>
            </div>
        </div>
    )
}
