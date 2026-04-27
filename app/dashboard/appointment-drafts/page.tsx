"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Download,
  UsersRound
} from "lucide-react";

/* ── UI Components ────────────────── */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/common/StatusBadge";
import { CopyButton } from "@/components/ui/copy-button"; 

import type { AppointmentDraft } from "@/types/appointment-draft";

/* ── DATA DUMMY SEMENTARA (SINKRON DENGAN DETAIL) ───────────────────── */
const MOCK_DRAFTS: Partial<AppointmentDraft>[] = [
  {
    id: "157",
    requestCode: "-", 
    status: "APPROVED",
    updatedAt: "2026-04-20T09:00:00.000Z",
    service: { name: "FISIOHOME", schedule: "2026-04-20T09:00:00.000Z" },
    patient: { name: "Yosua Satrio Wicaksono", phone: "+628172367127" } as any,
  },
  {
    id: "158",
    requestCode: "KA50505",
    status: "PENDING",
    updatedAt: "2026-04-20T07:00:00.000Z",
    service: { name: "FISIOHOME SPECIAL TIER", schedule: "2026-04-20T07:00:00.000Z" },
    patient: { name: "Said", phone: "+6287766556655" } as any,
  },
  {
    id: "159",
    requestCode: "KA50509",
    status: "IN_PROGRESS",
    updatedAt: "2026-04-22T09:00:00.000Z",
    service: { name: "FISIOHOME SPECIAL TIER", schedule: "2026-04-22T09:00:00.000Z" },
    patient: { name: "Said", phone: "+6287766556655" } as any,
  },
  {
    id: "3799",
    requestCode: "-",
    status: "EXPIRED",
    updatedAt: "2026-04-27T16:00:00.000Z",
    service: { name: "PERAWAT HOMECARE", schedule: "2026-04-20T09:00:00.000Z" },
    patient: { name: "Andrea Hanna Rininditia", phone: "+6285779737733" } as any,
  }
];

/* ── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function AppointmentDraftList() {
  const [drafts, setDrafts] = useState<Partial<AppointmentDraft>[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [limit, setLimit] = useState("10");

  useEffect(() => {
    setMounted(true);
    
    const fetchDrafts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-staging.fisiohome.id";
        const url = `${baseUrl}/api/v1/dashboard/appointment_drafts`;
        const token = Cookies.get("access_token");

        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(url, { cache: "no-store", headers });

        if (!res.ok) {
          setDrafts(MOCK_DRAFTS); // Fallback ke dummy jika API error
          setLoading(false);
          return;
        }

        const response = await res.json();
        const rawDataArray = response?.data?.data || response?.data || response; 
        
        if (!rawDataArray || rawDataArray.length === 0) {
           setDrafts(MOCK_DRAFTS);
        } else {
           // Mapping data dari API (opsional: panggil mapRawDataToDraftList jika perlu)
           setDrafts(MOCK_DRAFTS); // Sesuai permintaan: tampilkan dummy
        }
      } catch (error) {
        setDrafts(MOCK_DRAFTS);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  return (
    <div className="space-y-5 p-6 max-w-screen-xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#6200EE]">
          Appointment Drafts
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Kelola dan pantau semua draft pesanan sebelum dikonfirmasi
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Cari berdasarkan nomor registrasi…" 
            className="pl-9 h-10 rounded-xl border-slate-200 focus-visible:ring-violet-500/30" 
          />
        </div>
        <Button variant="outline" className="h-10 gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-violet-50">
          <Filter className="h-4 w-4" /> Filter Lanjutan
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <UsersRound className="h-4 w-4 text-[#6200EE]" />
            Daftar Pesanan (Draft)
          </h2>
          <Button variant="outline" size="sm" className="h-8 gap-2 border-slate-200 text-slate-600 rounded-lg text-xs">
            <Download className="h-3.5 w-3.5" /> Export Data
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                {["No. Registrasi", "Pasien", "Layanan", "Status", "Pembaruan Terakhir"].map((h) => (
                  <TableHead key={h} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3 px-5 bg-slate-50">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell className="py-4 px-5"><Skeleton className="h-4 w-24 rounded-md" /></TableCell>
                    <TableCell className="py-4 px-5"><Skeleton className="h-10 w-32 rounded-md" /></TableCell>
                    <TableCell className="py-4 px-5"><Skeleton className="h-5 w-28 rounded-md" /></TableCell>
                    <TableCell className="py-4 px-5"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="py-4 px-5"><Skeleton className="h-8 w-24 rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : (
                drafts.map((apt, i) => (
                  <TableRow key={apt.id} className={`group border-b border-slate-50 hover:bg-violet-50/40 transition-colors ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}>
                    {/* 1. Registration No - Logika ID-Fallback */}
                    <TableCell className="py-3.5 px-5 font-mono text-xs font-bold">
                      <div className="flex items-center justify-between group/copy">
                        <Link 
                          href={`/dashboard/appointment-drafts/${apt.id}`}
                          className="inline-flex items-center px-2.5 py-1 -ml-2.5 rounded-md text-violet-700 hover:bg-violet-100 transition-colors font-bold"
                        >
                          {apt.requestCode && apt.requestCode !== "-" ? apt.requestCode : `ID-${apt.id}`}
                        </Link>
                        <CopyButton
                          value={(apt.requestCode && apt.requestCode !== "-") ? apt.requestCode : `ID-${apt.id}`}
                          className="opacity-0 group-hover/copy:opacity-100 transition-opacity h-6 w-6"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 px-5">
                      <p className="text-sm font-bold text-slate-800 leading-tight capitalize">{apt.patient?.name?.toLowerCase() || "Unknown"}</p>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{apt.patient?.phone || "-"}</p>
                    </TableCell>

                    <TableCell className="py-3.5 px-5">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-violet-100/50 text-violet-800 text-[10px] font-bold tracking-wide">
                        {apt.service?.name?.replace(/_/g, " ") || "—"}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5 px-5">
                      <StatusBadge status={apt.status as any} />
                    </TableCell>

                    <TableCell className="py-3.5 px-5 font-mono text-[11px] font-semibold text-slate-600">
                      {mounted && apt.updatedAt ? (
                        <div className="leading-tight">
                          <p>{format(new Date(apt.updatedAt), "dd MMM yyyy")}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-sans">{format(new Date(apt.updatedAt), "HH:mm")} WIB</p>
                        </div>
                      ) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 gap-4 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <p className="text-xs font-medium text-slate-500">Menampilkan <span className="font-bold text-slate-800">{drafts.length}</span> data</p>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Batas</span>
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-violet-400 text-slate-700 cursor-pointer shadow-sm"
              >
                {[10, 50, 100].map((v) => <option key={v} value={String(v)}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled className="inline-flex items-center gap-1 px-3 py-1.5 h-8 rounded-lg text-xs font-semibold border-slate-200 text-slate-600">
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </Button>
            <Button variant="outline" disabled className="inline-flex items-center gap-1 px-3 py-1.5 h-8 rounded-lg text-xs font-semibold border-slate-200 text-slate-600">
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}