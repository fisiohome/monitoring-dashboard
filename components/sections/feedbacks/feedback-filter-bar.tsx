"use client";

import { useFilterParams } from "@/lib/hooks/use-filter-params";
import { Input } from "@/components/ui/input";

export function FeedbackFilterBar() {
  const { get, set } = useFilterParams();

  const startDateFilter = get("start_date") || "";
  const endDateFilter = get("end_date") || "";
  const therapistNameFilter = get("therapist_name") || "";
  const scoreFilter = get("score") || "";
  const commentFilter = get("has_comment") || "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-1.5 focus-within:ring-2 focus-within:ring-violet-500/20">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-1">
          Date Range
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={startDateFilter}
            onChange={(e) => set({ start_date: e.target.value })}
            className="h-8 text-xs border-0 bg-transparent shadow-none focus-visible:ring-0 px-1"
          />
          <span className="text-slate-300">-</span>
          <Input
            type="date"
            value={endDateFilter}
            onChange={(e) => set({ end_date: e.target.value })}
            className="h-8 text-xs border-0 bg-transparent shadow-none focus-visible:ring-0 px-1"
          />
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-1.5 focus-within:ring-2 focus-within:ring-violet-500/20">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-1">
          Therapist
        </label>
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="All therapist"
            value={therapistNameFilter}
            onChange={(e) => set({ therapist_name: e.target.value })}
            className="h-8 text-xs font-medium border-0 bg-transparent shadow-none focus-visible:ring-0 px-1 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-1.5 focus-within:ring-2 focus-within:ring-violet-500/20">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-1">
          Score
        </label>
        <div className="flex items-center">
          <select
            value={scoreFilter}
            onChange={(e) => set({ score: e.target.value })}
            className="w-full h-8 text-xs font-medium border-0 bg-transparent focus:ring-0 px-1 text-slate-700 cursor-pointer outline-none"
          >
            <option value="">All score</option>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-1.5 focus-within:ring-2 focus-within:ring-violet-500/20">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-1">
          Comment
        </label>
        <div className="flex items-center">
          <select
            value={commentFilter}
            onChange={(e) => set({ has_comment: e.target.value })}
            className="w-full h-8 text-xs font-medium border-0 bg-transparent focus:ring-0 px-1 text-slate-700 cursor-pointer outline-none"
          >
            <option value="">All review</option>
            <option value="true">With Comment</option>
            <option value="false">Without Comment</option>
          </select>
        </div>
      </div>
    </div>
  );
}
