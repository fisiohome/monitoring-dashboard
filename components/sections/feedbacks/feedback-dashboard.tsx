"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchFeedbacks, Feedback } from "@/lib/api/feedbacks";
import { useFilterParams } from "@/lib/hooks/use-filter-params";
import { formatDateFilter } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, BarChart2, AlignLeft, Award, CalendarDays } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function FeedbackDashboard() {
  const { get, searchParams } = useFilterParams();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Read filters
  const therapistName = get("therapist_name");
  const startDate = get("start_date");
  const endDate = get("end_date");
  const score = get("score");
  const hasComment = get("has_comment");

  useEffect(() => {
    async function loadAllFeedbacks() {
      setLoading(true);
      try {
        const params: any = {
          limit: 5000, // fetch large amount for accurate dashboard
          page: 1,
          ...(therapistName && { therapist_name: therapistName }),
          ...(startDate && { start_date: formatDateFilter(startDate) }),
          ...(endDate && { end_date: formatDateFilter(endDate, true) }),
          ...(score && { score }),
          ...(hasComment && { has_comment: hasComment }),
        };

        const response: any = await fetchFeedbacks(params);
        setFeedbacks(Array.isArray(response) ? response : (response.data || []));
      } catch (error) {
        console.error("Failed to load dashboard feedbacks", error);
      } finally {
        setLoading(false);
      }
    }

    loadAllFeedbacks();
  }, [searchParams.toString(), therapistName, startDate, endDate, score, hasComment]);

  const stats = useMemo(() => {
    if (!feedbacks.length) {
      return { total: 0, avg: 0, score5Percent: 0, commentPercent: 0 };
    }
    const total = feedbacks.length;
    const sum = feedbacks.reduce((acc, f) => acc + (f.average_rating || 0), 0);
    const score5Count = feedbacks.filter((f) => Math.round(f.average_rating) === 5).length;
    // Assuming comment existence is checked via cancellation_reason or special_notes, or a comment field.
    // Given we don't have a specific `comment` field in the type, we check potential fields.
    const commentCount = feedbacks.filter((f: any) => f.comment?.trim() || f.order?.special_notes?.trim()).length;

    return {
      total,
      avg: sum / total,
      score5Percent: (score5Count / total) * 100,
      commentPercent: (commentCount / total) * 100,
    };
  }, [feedbacks]);

  // Chart 1: Tren Average Review (By Date)
  const trendData = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    feedbacks.forEach((f) => {
      const d = f.created_at ? f.created_at.split("T")[0] : "";
      if (!d) return;
      const exist = map.get(d) || { total: 0, count: 0 };
      map.set(d, { total: exist.total + (f.average_rating || 0), count: exist.count + 1 });
    });
    return Array.from(map.entries())
      .map(([date, val]) => ({
        date,
        avg: Number((val.total / val.count).toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date)); // chronological
  }, [feedbacks]);

  // Chart 2: Distribusi Skor Review
  const distributionData = useMemo(() => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((f) => {
      const s = Math.round(f.average_rating || 0);
      if (s >= 1 && s <= 5) dist[s as keyof typeof dist]++;
    });
    return Object.entries(dist).map(([skor, jumlah]) => ({ skor, jumlah }));
  }, [feedbacks]);

  // Chart 3: Perbandingan Skor per Aspek
  const aspectData = useMemo(() => {
    if (!feedbacks.length) return [];
    const t = feedbacks.length;
    const comm = feedbacks.reduce((a, b) => a + (b.communication_rating || 0), 0);
    const serv = feedbacks.reduce((a, b) => a + (b.service_rating || 0), 0);
    const eff = feedbacks.reduce((a, b) => a + (b.effectiveness_rating || 0), 0);
    const app = feedbacks.reduce((a, b) => a + (b.appearance_rating || 0), 0);
    return [
      { name: "Communication", score: Number((comm / t).toFixed(2)) },
      { name: "Service", score: Number((serv / t).toFixed(2)) },
      { name: "Effectiveness", score: Number((eff / t).toFixed(2)) },
      { name: "Appearance", score: Number((app / t).toFixed(2)) },
    ];
  }, [feedbacks]);

  // Chart 4: Top Therapist by Rating (Top 5)
  const therapistData = useMemo(() => {
    const map = new Map<string, { sum: number; count: number }>();
    feedbacks.forEach((f) => {
      const name = f.therapist_name || "Unknown";
      const exist = map.get(name) || { sum: 0, count: 0 };
      map.set(name, { sum: exist.sum + (f.average_rating || 0), count: exist.count + 1 });
    });
    return Array.from(map.entries())
      .map(([name, val]) => ({
        name: name.split(" ")[0], // abbreviate
        score: val.sum / val.count,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .reverse(); // Reverse for horizontal bar (highest at top depending on layout)
  }, [feedbacks]);

  // Chart 5: Volume Review Harian
  const volumeData = useMemo(() => {
    const map = new Map<string, number>();
    feedbacks.forEach((f) => {
      const d = f.created_at ? f.created_at.split("T")[0] : "";
      if (!d) return;
      map.set(d, (map.get(d) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([date, jumlah]) => ({
        date: date.slice(8, 10) + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(date.slice(5, 7))-1], // "09 Mar" format
        jumlah,
        rawDate: date,
      }))
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate));
  }, [feedbacks]);

  if (loading) {
    return <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Skeleton className="h-28 w-full rounded-2xl" /><Skeleton className="h-28 w-full rounded-2xl" /><Skeleton className="h-28 w-full rounded-2xl" /><Skeleton className="h-28 w-full rounded-2xl" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Skeleton className="h-80 w-full rounded-2xl" /><Skeleton className="h-80 w-full rounded-2xl" /></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Reviews", value: stats.total, sub: "Jumlah review masuk", color: "text-[#6200EE]" },
          { title: "Average Rating", value: stats.avg.toFixed(2), sub: "Rata rata review", color: "text-[#6200EE]" },
          { title: "% Score 5", value: `${Math.round(stats.score5Percent)}%`, sub: "Review nilai sempurna", color: "text-[#6200EE]" },
          { title: "Comment Rate", value: `${Math.round(stats.commentPercent)}%`, sub: "Review dengan komentar", color: "text-[#6200EE]" },
        ].map((c, i) => (
          <div key={i} className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-center">
            <h3 className="text-[13px] font-bold text-slate-900 mb-1">{c.title}</h3>
            <p className={`text-4xl font-extrabold ${c.color} leading-none mb-2 tracking-tight`}>{c.value}</p>
            <p className="text-[11px] text-slate-400 font-medium">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
        
        {/* Tren Average Review */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2.5 mb-6">
            <TrendingUp className="w-4 h-4 text-[#6200EE]" />
            <h3 className="text-[13.5px] font-semibold text-slate-800">Tren Average Review</h3>
          </div>
          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} tickFormatter={(v) => v.slice(5)} dy={10} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="avg" stroke="#6200EE" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" activeDot={{ r: 6, strokeWidth: 0, fill: '#6200EE' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribusi Skor Review */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2.5 mb-6">
            <BarChart2 className="w-4 h-4 text-[#6200EE]" />
            <h3 className="text-[13.5px] font-semibold text-slate-800">Distribusi Skor Review</h3>
          </div>
          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6200EE" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="skor" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} dx={-10} allowDecimals={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="jumlah" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Perbandingan Skor per Aspek */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2.5 mb-6">
            <AlignLeft className="w-4 h-4 text-[#6200EE]" />
            <h3 className="text-[13.5px] font-semibold text-slate-800">Perbandingan Skor per Aspek</h3>
          </div>
          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aspectData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                 <defs>
                  <linearGradient id="barGradientH" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#6200EE" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#475569', fontWeight: 500}} width={95} dx={-15} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="score" fill="url(#barGradientH)" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Therapist by Rating */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2.5 mb-6">
            <Award className="w-4 h-4 text-[#6200EE]" />
            <h3 className="text-[13.5px] font-semibold text-slate-800">Top Therapist by Rating</h3>
          </div>
          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={therapistData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradientH2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#475569', fontWeight: 500}} width={70} dx={-10} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="score" fill="url(#barGradientH2)" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Review Harian */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-6">
            <CalendarDays className="w-4 h-4 text-[#6200EE]" />
            <h3 className="text-[13.5px] font-semibold text-slate-800">Volume Review Harian</h3>
          </div>
          <div className="h-72 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#7e22ce" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} dx={-10} allowDecimals={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="jumlah" fill="url(#barGradient3)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
