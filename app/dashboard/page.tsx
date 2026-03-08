"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { FunnelChart } from "@/components/dashboard/FunnelChart";

import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { ActionableOrderTable } from "@/components/dashboard/ActionableOrderTable";
import {
  fetchDashboardSummary,
  fetchDailyMetrics,
  DashboardSummary,
  DailyMetrics,
  StuckOrder,
} from "@/lib/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [summaryData, metricsData] = await Promise.all([
          fetchDashboardSummary(),
          fetchDailyMetrics(),
        ]);
        setSummary(summaryData);
        setDailyMetrics(metricsData);
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

  // Map summary → StatsCards format
  const statsData = summary
    ? {
        orders: {
          total_today: summary.total_orders_today,
          success: summary.order_success.count,
          stuck_count: summary.stuck_orders.count,
        },
        payment: {
          pending_stuck_count: summary.pending_payments.count,
        },
        revenue: {
          total_this_month: summary.total_income_this_month,
        },
      }
    : undefined;

  // Map summary stuck orders → StuckOrder[]
  const stuckOrders: StuckOrder[] =
    summary?.stuck_orders.orders.map((order) => ({
      id: order.id,
      registration_number: order.registration_number,
      customer_name: order.user.email,
      customer_phone: order.user.phone ?? undefined,
      status: "PENDING_PAYMENT",
      time_elapsed: `${order.age_minutes} mins`,
      step: "Payment" as const,
      created_at: order.created_at,
    })) ?? [];

  // Map daily metrics → FunnelChart format
  const funnelData = dailyMetrics
    ? {
        users: dailyMetrics.total_users,
        registrations: dailyMetrics.new_users_today,
        bookings_started: dailyMetrics.total_visits_today,
        bookings_completed: dailyMetrics.completed_visits_today,
        payments_success: dailyMetrics.paid_orders_today,
      }
    : undefined;

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Operations Overview
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring for CS & Ops Lead
          </p>
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
          <StatsCards data={statsData} />

          <div className="w-full">
            <FunnelChart data={funnelData} />
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
  );
}
