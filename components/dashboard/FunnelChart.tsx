"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, CalendarCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DailyMetrics {
  total_users: number;
  new_users_today: number;
  total_visits_today: number;
  completed_visits_today: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("id-ID");
}

function MetricFunnel({
  title,
  icon,
  baseLabel,
  baseValue,
  subLabel,
  subValue,
  baseColor,
  subColor,
  baseGradientId,
  subGradientId,
  baseFrom,
  baseTo,
  subFrom,
  subTo,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  baseLabel: string;
  baseValue: number;
  subLabel: string;
  subValue: number;
  baseColor: string;
  subColor: string;
  baseGradientId: string;
  subGradientId: string;
  baseFrom: string;
  baseTo: string;
  subFrom: string;
  subTo: string;
  onClick?: () => void;
}) {
  const subPct =
    baseValue > 0 ? Math.min((subValue / baseValue) * 100, 100) : 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-4 -m-4 rounded-xl transition-colors",
        onClick && "cursor-pointer hover:bg-slate-50/80 group",
      )}
      onClick={onClick}
    >
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${baseFrom}18` }}
          >
            <span style={{ color: baseFrom }}>{icon}</span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
            {title}
          </span>
        </div>
        {onClick && (
          <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-slate-600 transition-all -translate-x-2 group-hover:translate-x-0" />
        )}
      </div>

      {/* Base metric */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs text-slate-400 mb-1">{baseLabel}</p>
          <div className="h-3 w-full rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full w-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${baseFrom}, ${baseTo})`,
              }}
            />
          </div>
        </div>
        <span
          className="text-xl font-bold shrink-0 tabular-nums w-16 text-right"
          style={{ color: baseFrom }}
        >
          {formatNumber(baseValue)}
        </span>
      </div>

      {/* Sub metric */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-400">{subLabel}</p>
            <span className="text-[10px] font-bold text-slate-400">
              {subPct.toFixed(1)}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${subPct}%`,
                background: `linear-gradient(to right, ${subFrom}, ${subTo})`,
              }}
            />
          </div>
        </div>
        <span
          className="text-xl font-bold shrink-0 tabular-nums w-16 text-right"
          style={{ color: subFrom }}
        >
          {formatNumber(subValue)}
        </span>
      </div>
    </div>
  );
}

export function FunnelChart({ data }: { data?: DailyMetrics }) {
  const router = useRouter();

  if (!data) return null;

  const visitCompletionRate =
    data.total_visits_today > 0
      ? ((data.completed_visits_today / data.total_visits_today) * 100).toFixed(
          1,
        )
      : "0";

  const newUserRate =
    data.total_users > 0
      ? ((data.new_users_today / data.total_users) * 100).toFixed(2)
      : "0";

  return (
    <Card className="rounded-3xl border-none shadow-sm xl:col-span-2 bg-white h-full overflow-hidden">
      <CardHeader className="pb-3 pt-5 px-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Today's Overview
            </p>
            <p className="text-2xl font-bold text-slate-800 leading-tight">
              {visitCompletionRate}%
              <span className="text-sm font-normal text-slate-400 ml-2">
                visit completion rate
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-0.5">New users</p>
            <p className="text-sm font-bold text-[#6200EE]">
              +{data.new_users_today}
              <span className="text-xs font-normal text-slate-400 ml-1">
                ({newUserRate}%)
              </span>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-1">
        <div className="h-px bg-slate-100 mb-5" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Users funnel */}
          <MetricFunnel
            title="Users"
            icon={<Users className="h-3.5 w-3.5" />}
            baseLabel="Total users"
            baseValue={data.total_users}
            subLabel="New today"
            subValue={data.new_users_today}
            baseColor="#6200EE"
            subColor="#7C3AED"
            baseGradientId="usersBase"
            subGradientId="usersSub"
            baseFrom="#6200EE"
            baseTo="#7C3AED"
            subFrom="#A78BFA"
            subTo="#C4B5FD"
          />

          {/* Visits funnel */}
          <MetricFunnel
            title="Visits"
            icon={<CalendarCheck className="h-3.5 w-3.5" />}
            baseLabel="Total visits today"
            baseValue={data.total_visits_today}
            subLabel="Completed"
            subValue={data.completed_visits_today}
            baseColor="#0ea5e9"
            subColor="#0284c7"
            baseGradientId="visitsBase"
            subGradientId="visitsSub"
            baseFrom="#0ea5e9"
            baseTo="#38bdf8"
            subFrom="#0284c7"
            subTo="#0ea5e9"
            onClick={() => {
              const today = format(new Date(), "yyyy-MM-dd");
              router.push(`/dashboard/appointments?date=${today}&page=1`);
            }}
          />
        </div>

        {/* Bottom summary strip */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-purple-50 rounded-2xl px-4 py-3">
            <p className="text-xs text-purple-400 font-medium mb-0.5">
              Total Users
            </p>
            <p className="text-lg font-bold text-[#6200EE]">
              {formatNumber(data.total_users)}
            </p>
            <p className="text-xs text-purple-300 mt-0.5">
              +{data.new_users_today} hari ini
            </p>
          </div>
          <div className="bg-sky-50 rounded-2xl px-4 py-3">
            <p className="text-xs text-sky-400 font-medium mb-0.5">
              Visits Today
            </p>
            <p className="text-lg font-bold text-sky-600">
              {formatNumber(data.total_visits_today)}
            </p>
            <p className="text-xs text-sky-300 mt-0.5">
              {data.completed_visits_today} selesai
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
