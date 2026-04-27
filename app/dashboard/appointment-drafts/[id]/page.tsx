"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { format } from "date-fns";
import {
  ArrowLeft,
  User,
  MapPin,
  ClipboardList,
  UserCheck,
  Clock,
  Activity,
  Phone,
  Mail,
  Stethoscope, // Icon baru untuk medical
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import type { AppointmentDraft } from "@/types/appointment-draft";

/* ── DATA DUMMY SEMENTARA ─────────────────────────────────────────── */
const MOCK_DETAILS: Record<string, Partial<AppointmentDraft>> = {
  "157": {
    id: "157",
    requestCode: "KA50507",
    status: "PENDING",
    lastStep: "Draft Initialized",
    updatedAt: "2026-04-20T09:00:00.000Z",
    patient: { name: "Yosua Satrio Wicaksono", gender: "MALE", age: 28, dateOfBirth: "1997-05-09T00:00:00.000Z" } as any,
    client: { name: "Pasien Jember", phone: "+628172367127", email: "patient1@yopmail.com" },
    location: { address: "Perumahan Bumi Mutiara Blok JK4 No 16, Kec. Bojong Kulur", city: "KAB. BOGOR", province: "JAWA BARAT", postalCode: "-" },
    service: { name: "FISIOHOME", schedule: "2026-04-20T09:00:00.000Z" },
    pic: { name: "Yosua Satrio Wicaksono", email: "yosua@fisiohome.id" } as any,
    medicalRecord: { condition: "NORMAL", history: "N/A", onsetDate: "N/A", complaint: "Gak mood" },
  },
  "158": {
    id: "158",
    requestCode: "KA50505",
    status: "PENDING", 
    lastStep: "Draft Initialized",
    updatedAt: "2026-04-20T07:00:00.000Z",
    patient: { name: "Said", gender: "MALE", age: 28, dateOfBirth: "1997-05-14T00:00:00.000Z" } as any, 
    client: { name: "said", phone: "+6287766556655", email: "said@fisiohome.id" },
    location: { address: "Green Pramuka City, Jakarta Pusat", city: "KOTA ADM. JAKARTA PUSAT", province: "DKI Jakarta", postalCode: "10570" },
    service: { name: "FISIOHOME SPECIAL TIER", schedule: "2026-04-20T07:00:00.000Z" },
    pic: { name: "Tech Admin", email: "tech@fisiohome.id" } as any,
    medicalRecord: { condition: "NORMAL", history: "N/A", onsetDate: "N/A", complaint: "pegal-pegal" },
  },
  "159": {
    id: "159",
    requestCode: "KA50509",
    status: "PENDING", 
    lastStep: "Draft Initialized",
    updatedAt: "2026-04-22T09:00:00.000Z",
    patient: { name: "Said", gender: "MALE", age: 28, dateOfBirth: "1997-05-14T00:00:00.000Z" } as any, 
    client: { name: "said", phone: "+6287766556655", email: "said@fisiohome.id" },
    location: { address: "Green Pramuka City, Jakarta Pusat", city: "KOTA ADM. JAKARTA PUSAT", province: "DKI Jakarta", postalCode: "10570" },
    service: { name: "FISIOHOME SPECIAL TIER", schedule: "2026-04-22T09:00:00.000Z" },
    pic: { name: "Tech Admin", email: "tech@fisiohome.id" } as any,
    medicalRecord: { condition: "NORMAL", history: "N/A", onsetDate: "N/A", complaint: "sakit hati daripada sakit gigi" },
  },
  "3799": {
    id: "3799",
    requestCode: "-",
    status: "PENDING",
    lastStep: "additional_settings",
    updatedAt: "2026-04-27T16:00:00.000Z", 
    patient: { name: "Andrea Hanna Rininditia", gender: "FEMALE", age: 25, dateOfBirth: "2000-05-10T17:00:00.000Z" } as any,
    client: { name: "Yonathan Adi Prasetya", phone: "+6285779737733", email: "deahnnr@gmail.com" },
    location: { address: "Batavia Apartment Tower 2 Unit 10-01", city: "KOTA ADM. JAKARTA PUSAT", province: "-", postalCode: "-" },
    service: { name: "PERAWAT HOMECARE", schedule: "2026-04-20T09:00:00.000Z" },
    pic: { name: "Maria Nareva Hayundia", email: "narevahmp@gmail.com" } as any,
    medicalRecord: { condition: "NORMAL", history: "Gerd", onsetDate: "N/A", complaint: "Badan lemas dan terasa ngilu" },
  }
};

/* ── MAPPING FUNCTION (MESIN PENERJEMAH DATA) ─────────────────────── */
function mapRawDataToDraft(rawData: any): AppointmentDraft {
  const form = rawData?.form_data || rawData; 
  const patientDetails = form?.patientDetails || {};
  const additionalSettings = form?.additionalSettings || {};

  return {
    id: rawData?.id?.toString() || form?.formOptions?.draftId || "Unknown ID",
    requestCode: form?.formOptions?.queueCode || "-",
    status: rawData?.status || "PENDING",
    statusReason: rawData?.status_reason || "Tidak ada catatan status.",
    lastStep: rawData?.current_step || "Draft Created",
    updatedAt: rawData?.updated_at || rawData?.updatedAt || new Date().toISOString(),

    patient: {
      name: patientDetails?.fullName || "Nama Tidak Terdaftar",
      phone: patientDetails?.phone || "-",
      email: patientDetails?.email || undefined,
      gender: patientDetails?.gender || "UNKNOWN",
      age: patientDetails?.age,
      dateOfBirth: patientDetails?.dateOfBirth,
    },

    client: form?.contactInformation ? {
      name: form.contactInformation.contactName || form.contactInformation.name || "-",
      phone: form.contactInformation.contactPhone || form.contactInformation.phone || "-",
      email: form.contactInformation.email,
    } : undefined,

    location: {
      address: patientDetails?.address || "Alamat belum diisi",
      city: patientDetails?.location?.city || "-",
      province: patientDetails?.location?.province || "-",
      postalCode: patientDetails?.postalCode || "-",
    },

    service: {
      name: form?.appointmentScheduling?.service?.name?.replace(/_/g, " ") || form?.serviceDetails?.name?.replace(/_/g, " ") || "Layanan Belum Dipilih",
      schedule: form?.appointmentScheduling?.appointmentDateTime || form?.scheduleDate || new Date().toISOString(),
    },

    pic: {
      name: additionalSettings?.admins?.[0]?.name || "Belum ada PIC",
      email: additionalSettings?.admins?.[0]?.email || "-",
      phone: "-",
    },

    // ── MEDICAL RECORD MAPPING ──
    medicalRecord: {
      condition: patientDetails?.condition || "N/A",
      history: patientDetails?.medicalHistory || "N/A",
      onsetDate: patientDetails?.illnessOnsetDate || "N/A",
      complaint: patientDetails?.complaintDescription || "N/A",
    } as any,
  };
}

/* ── UTILITY FETCH ──────────────────────────────────────────────────── */
async function getDraft(id: string): Promise<AppointmentDraft | null> {
  const fallbackDraft = MOCK_DETAILS[id] as AppointmentDraft | undefined;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-staging.fisiohome.id";
    const url = `${baseUrl}/api/v1/dashboard/appointment_drafts/${id}`;
    const token = Cookies.get("access_token");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, { cache: "no-store", headers });
    if (!res.ok) return fallbackDraft ?? null;
    const response = await res.json();
    return mapRawDataToDraft(response?.data ?? response);
  } catch (error) {
    return fallbackDraft ?? null;
  }
}

/* ── MAIN PAGE COMPONENT ────────────────────────────────────────────── */
export default function DraftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [draft, setDraft] = useState<AppointmentDraft | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDraft(id);
      setDraft(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <DetailPageSkeleton />;

  if (!draft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <ClipboardList className="h-12 w-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">404 - Draft Tidak Ditemukan</h2>
        <Button variant="outline" onClick={() => router.back()}>Kembali ke Daftar</Button>
      </div>
    );
  }

  // Format onsetDate agar tidak error (Invalid Date) jika string kosong/N/A
  const rawOnset = (draft as any).medicalRecord?.onsetDate;
  const formattedOnset = (rawOnset && rawOnset !== "N/A" && rawOnset !== "") 
    ? format(new Date(rawOnset), "dd MMM yyyy") 
    : "N/A";

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={() => router.back()} className="pl-0 text-slate-600 group hover:bg-transparent hover:text-[#6200EE]">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar
        </Button>
      </div>

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#6200EE] to-[#9747FF] p-6 md:p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,#fff_0%,transparent_70%)]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 group/copy">
                <h1 className="text-3xl font-black tracking-tight">{draft.requestCode !== "-" ? draft.requestCode : `ID-${draft.id}`}</h1>
                <CopyButton value={draft.requestCode !== "-" ? draft.requestCode : `ID-${draft.id}`} className="opacity-0 group-hover/copy:opacity-100 transition-opacity text-white/70 hover:text-white hover:bg-white/20" />
              </div>
              <StatusBadge status={draft.status} />
            </div>
            <div className="flex items-center gap-2 group/copy">
              <p className="text-white/60 text-xs font-mono">Internal ID: {draft.id}</p>
              <CopyButton value={draft.id} className="opacity-0 group-hover/copy:opacity-100 transition-opacity text-white/50 hover:text-white hover:bg-white/20 h-4 w-4 p-0.5" />
            </div>
          </div>
          
          {/* 3. TAHAPAN SAAT INI (Kombo dgn UpdatedAt) */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[220px] text-right">
            <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mb-1">Tahapan Saat Ini</p>
            <p className="text-xl font-bold capitalize">{draft.lastStep.replace(/_/g, " ")}</p>
            <div className="flex items-center justify-end gap-1.5 text-white/70 text-[10px] mt-1.5 font-medium">
              <Clock className="h-3 w-3" />
              {draft.updatedAt ? format(new Date(draft.updatedAt), "dd MMM yyyy, HH:mm") : "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Informasi Pasien, Klien & Medical Record */}
          <SectionCard icon={<User className="h-5 w-5" />} iconBg="bg-indigo-50 text-indigo-600" title="Informasi Pasien & Klien">
            
            {/* 1. DATA PEMESAN */}
            {draft.client && (
              <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="mb-3 text-[10px] font-black text-[#6200EE] uppercase tracking-widest">Data Pemesan (Client)</div>
                <div className="grid grid-cols-2 gap-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <InfoItem label="Nama Pemesan" value={draft.client.name} span />
                  <InfoItem label="Telepon Pemesan" value={draft.client.phone} />
                  <InfoItem label="Email Pemesan" value={draft.client.email} />
                </div>
                <Separator className="mt-8" />
              </div>
            )}

            {/* 2. DATA PASIEN (BASIC) */}
            <div className="mt-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Pasien (Basic)</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <InfoItem label="Full Name" value={draft.patient.name} />
              <InfoItem label="Gender" value={(draft.patient as any).gender} capitalize />
              <InfoItem label="Age" value={draft.patient.age ? `${draft.patient.age} Tahun` : "-"} />
              <InfoItem label="Date of Birth" value={draft.patient.dateOfBirth ? format(new Date(draft.patient.dateOfBirth), "dd MMM yyyy") : "-"} />
            </div>

            <Separator className="my-6" />

            {/* 3. MEDICAL RECORD SECTION */}
           
           <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="h-4 w-4 text-purple-500" />
              <div className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Medical Record</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-purple-50/40 p-5 rounded-2xl border border-purple-100/50">
              <InfoItem label="Patient Condition" value={(draft as any).medicalRecord?.condition} />
              <InfoItem label="Illness Onset Date" value={formattedOnset} />
              <div className="col-span-1 sm:col-span-2">
                <InfoItem label="Medical History" value={(draft as any).medicalRecord?.history || "N/A"} span />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <InfoItem label="Complaint Description" value={(draft as any).medicalRecord?.complaint || "N/A"} span />
              </div>
            </div>
          </SectionCard>

          {/* Location Info */}
          <SectionCard icon={<MapPin className="h-5 w-5" />} iconBg="bg-rose-50 text-rose-600" title="Detail Lokasi">
            <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">{draft.location.address}</p>
            <div className="flex flex-wrap gap-2">
              {draft.location.city !== "-" && <Badge variant="secondary" className="bg-slate-100 text-slate-600">{draft.location.city}</Badge>}
              {draft.location.province !== "-" && <Badge variant="secondary" className="bg-slate-100 text-slate-600">{draft.location.province}</Badge>}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          {/* Service Info */}
          <div className="bg-[#6200EE] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <Activity className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5 rotate-12" />
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-1">Paket Layanan</p>
                <h3 className="text-xl font-black">{draft.service.name}</h3>
              </div>
              <Separator className="bg-white/20" />
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2">
                <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Jadwal Rencana</p>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold">
                     {draft.service.schedule ? format(new Date(draft.service.schedule), "EEEE, d MMMM yyyy") : "Belum Dijadwalkan"}
                  </span>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{draft.service.schedule ? format(new Date(draft.service.schedule), "HH:mm") : "--:--"}</span>
                  </div>
                </div>
              </div>
              {/* Box Keluhan sudah dihapus dari sini */}
            </div>
          </div>

          {/* PIC Info */}
          <SectionCard icon={<UserCheck className="h-5 w-5" />} iconBg="bg-teal-100 text-teal-600" title="Admin PIC">
             <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-bold shrink-0 text-center">
                <UserCheck className="h-6 w-6 text-teal-500" />
              </div>
              <div className="flex-1 space-y-2 overflow-hidden">
                <p className="text-base font-bold text-slate-900 leading-none truncate">{draft.pic.name}</p>
                <div className="flex flex-col gap-1.5">
                  {draft.pic.email && (
                    <a href={`mailto:${draft.pic.email}`} className="flex items-center gap-1.5 text-xs text-slate-600 hover:underline truncate">
                      <Mail className="h-3 w-3 shrink-0" /> {draft.pic.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ── UI HELPERS ─────────────────────────────────────────────────────── */

function SectionCard({ icon, iconBg, title, children }: any) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
        <div className={`p-2 rounded-xl ${iconBg}`}>{icon}</div>
        <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoItem({ label, value, capitalize, span }: any) {
  return (
    <div className={span ? "col-span-2" : "col-span-1"}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{label}</p>
      <p className={`text-sm font-bold text-slate-700 ${capitalize ? "capitalize" : ""} ${value === "N/A" ? "text-slate-400 italic" : ""}`}>
        {value || "N/A"}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
    COMPLETED: "bg-teal-100 text-teal-700 border-teal-200",
  };
  const currentStyle = statusConfig[status] || "bg-slate-50 text-slate-400 border-slate-100";
  return (
    <Badge variant="outline" className={`rounded-full px-3 py-1 border font-bold text-[10px] tracking-wide uppercase ${currentStyle}`}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function DetailPageSkeleton() {
  return (
    <main className="container mx-auto max-w-6xl py-6 space-y-8 animate-pulse">
      <header className="flex items-center justify-between mb-8"><div className="h-10 w-64 bg-slate-200 rounded-lg" /><div className="h-10 w-28 bg-slate-200 rounded-full" /></header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6"><section className="h-64 bg-white border border-slate-200 rounded-3xl" /><section className="h-40 bg-white border border-slate-200 rounded-3xl" /></div>
        <div className="space-y-6"><section className="h-64 bg-slate-200 rounded-3xl" /><section className="h-32 bg-white border border-slate-200 rounded-3xl" /></div>
      </div>
    </main>
  );
}