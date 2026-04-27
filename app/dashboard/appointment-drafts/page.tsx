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
  UsersRound,
  Loader2
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

/* ── DATA DUMMY SEMENTARA (157, 158, 159, 3799) ───────────────────── */
const MOCK_DRAFTS: Partial<AppointmentDraft>[] = [
  {
    id: "157",
    requestCode: "-", 
    status: "APPROVED",
    updatedAt: "2026-04-20T09:00:00.000Z",
    service: { name: "FISIOHOME", schedule: "", note: "" },
    patient: { name: "Yosua Satrio Wicaksono", phone: "+628172367127", email: "", gender: "MALE" },
  },
  {
    id: "158",
    requestCode: "KA50505",
    status: "PENDING",
    updatedAt: "2026-04-20T07:00:00.000Z",
    service: { name: "FISIOHOME SPECIAL TIER", schedule: "", note: "" },
    patient: { name: "Said", phone: "+6287766556655", email: "", gender: "MALE" },
  },
  {
    id: "159",
    requestCode: "KA50509",
    status: "APPROVED",
    updatedAt: "2026-04-22T09:00:00.000Z",
    service: { name: "FISIOHOME SPECIAL TIER", schedule: "", note: "" },
    patient: { name: "Said", phone: "+6287766556655", email: "", gender: "MALE" },
  },
  {
    id: "3799",
    requestCode: "-", 
    status: "IN_PROGRESS", // Dibuat in progress agar variatif
    updatedAt: "2026-04-27T16:00:00.000Z",
    service: { name: "PERAWAT HOMECARE", schedule: "", note: "" },
    patient: { name: "Andrea Hanna Rininditia", phone: "+6285779737733", email: "deahnnr@gmail.com", gender: "FEMALE" },
  },
];

/* ── MAPPING FUNCTION UNTUK LIST ───────────────────────────────────── */
function mapRawDataToDraftList(rawDataArray: any[]): Partial<AppointmentDraft>[] {
  if (!Array.isArray(rawDataArray)) return [];

  return rawDataArray.map((item) => {
    const form = item?.form_data || item;
    const patientDetails = form?.patientDetails || {};

    return {
      id: item?.id?.toString() || form?.formOptions?.draftId || "Unknown",
      requestCode: form?.formOptions?.queueCode || "-",
      status: item?.status || "PENDING",
      updatedAt: item?.updated_at || item?.updatedAt || new Date().toISOString(),
      service: {
        name: form?.appointmentScheduling?.service?.name?.replace(/_/g, " ") || form?.serviceDetails?.name?.replace(/_/g, " ") || "Belum Dipilih",
        schedule: form?.appointmentScheduling?.appointmentDateTime || form?.scheduleDate || "",
      },
      patient: {
        name: patientDetails?.fullName || form?.contactInformation?.contactName || "Tanpa Nama",
        phone: patientDetails?.phone || form?.contactInformation?.contactPhone || "-",
        gender: patientDetails?.gender || "UNKNOWN",
      }
    };
  });
}

/* ── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function AppointmentDraftList() {
  const [drafts, setDrafts] = useState<Partial<AppointmentDraft>[]>([]);
  const [loading, setLoading] = useState(true);
  
  // STATE UNTUK HYDRATION & PAGINATION UI
  const [mounted, setMounted] = useState(false);
  const [limit, setLimit] = useState("10");

  useEffect(() => {
    setMounted(true);
    
    // FUNGSI FETCH API
    const fetchDrafts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-staging.fisiohome.id";
        const url = `${baseUrl}/api/v1/dashboard/appointment_drafts`;
        const token = Cookies.get("access_token");

        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(url, { cache: "no-store", headers });

        if (!res.ok) {
          console.warn(`API Error ${res.status}. Memakai data dummy list.`);
          setDrafts(MOCK_DRAFTS);
          setLoading(false);
          return;
        }

        const response = await res.json();
        
        // Asumsi struktur pagination backend: response.data.data atau array langsung di response.data
        const rawDataArray = response?.data?.data || response?.data || response; 
        
        // Jika data dari API kosong, fallback ke dummy untuk keperluan testing UI
        if (!rawDataArray || rawDataArray.length === 0) {
           setDrafts(MOCK_DRAFTS);
        } else {
           setDrafts(mapRawDataToDraftList(rawDataArray));
        }
      } catch (error) {
        console.error("Gagal terhubung ke API:", error);
        setDrafts(MOCK_DRAFTS); // Fallback ke mock jika server mati
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  return (
    <div className="space-y-5 p-6 max-w-screen-xl mx-auto animate-in fade-in duration-500">
      {/* ===== Header Section ===== */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#6200EE]">
          Appointment Drafts
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Kelola dan pantau semua draft pesanan sebelum dikonfirmasi
        </p>
      </div>

      {/* ===== Toolbar Section ===== */}
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

      {/* ===== Table Container ===== */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Table Header Action Bar */}
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
                  <TableHead
                    key={h}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3 px-5 bg-slate-50"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {/* STATE 1: LOADING */}
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell className="py-4 px-5"><Skeleton className="h-4 w-24 rounded-md" /></TableCell>
                    <TableCell className="py-4 px-5">
                      <Skeleton className="h-4 w-32 rounded-md mb-2" />
                      <Skeleton className="h-3 w-24 rounded-md" />
                    </TableCell>
                    <TableCell className="py-4 px-5"><Skeleton className="h-5 w-28 rounded-md" /></TableCell>
                    <TableCell className="py-4 px-5"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="py-4 px-5"><Skeleton className="h-8 w-24 rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : 
              
              /* STATE 2: EMPTY DATA */
              drafts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                      <UsersRound className="h-8 w-8 text-slate-300" />
                      <p className="text-sm font-medium">Tidak ada data draft ditemukan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : 
              
              /* STATE 3: DATA READY */
              (
                drafts.map((apt, i) => (
                  <TableRow
                    key={apt.id}
                    className={`group border-b border-slate-50 hover:bg-violet-50/40 transition-colors ${
                      i % 2 === 1 ? "bg-slate-50/30" : ""
                    }`}
                  >
                    {/* 1. Registration No */}
                    <TableCell className="py-3.5 px-5 font-mono text-xs font-bold">
                      <div className="flex items-center justify-between group/copy">
                        <Link 
                          href={`/dashboard/appointment-drafts/${apt.id}`}
                          className="inline-flex items-center px-2.5 py-1 -ml-2.5 rounded-md text-violet-700 hover:bg-violet-100 transition-colors"
                        >
                          {/* Logika handle request code kosong diganti dengan ID */}
                          {apt.requestCode && apt.requestCode !== "-" ? apt.requestCode : `ID-${apt.id}`}
                        </Link>
                        <CopyButton
                          value={(apt.requestCode && apt.requestCode !== "-") ? apt.requestCode : `ID-${apt.id}`}
                          className="opacity-0 group-hover/copy:opacity-100 transition-opacity h-6 w-6"
                        />
                      </div>
                    </TableCell>

                    {/* 2. Patient Details */}
                    <TableCell className="py-3.5 px-5">
                      <p className="text-sm font-bold text-slate-800 leading-tight capitalize">
                        {apt.patient?.name?.toLowerCase() || "Unknown"}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                        {apt.patient?.phone || "-"}
                      </p>
                    </TableCell>

                    {/* 3. Service Tag */}
                    <TableCell className="py-3.5 px-5">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-violet-100/50 text-violet-800 text-[10px] font-bold tracking-wide">
                        {apt.service?.name?.replace(/_/g, " ") || "—"}
                      </span>
                    </TableCell>

                    {/* 4. Status Badge */}
                    <TableCell className="py-3.5 px-5">
                      <StatusBadge status={apt.status as any} />
                    </TableCell>

                    {/* 5. Last Updated */}
                    <TableCell className="py-3.5 px-5 font-mono text-[11px] font-semibold text-slate-600">
                      {mounted && apt.updatedAt ? (
                        <div className="leading-tight">
                          <p>{format(new Date(apt.updatedAt), "dd MMM yyyy")}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                            {format(new Date(apt.updatedAt), "HH:mm")} WIB
                          </p>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ===== Pagination Footer ===== */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 gap-4 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <p className="text-xs font-medium text-slate-500">
              Menampilkan <span className="font-bold text-slate-800">{drafts.length}</span> data
            </p>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Batas
              </span>
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-violet-400 text-slate-700 cursor-pointer shadow-sm"
              >
                {[10, 50, 100].map((v) => (
                  <option key={v} value={String(v)}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled
              className="inline-flex items-center gap-1 px-3 py-1.5 h-8 rounded-lg text-xs font-semibold border-slate-200 text-slate-600"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </Button>
            <Button
              variant="outline"
              disabled
              className="inline-flex items-center gap-1 px-3 py-1.5 h-8 rounded-lg text-xs font-semibold border-slate-200 text-slate-600"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}