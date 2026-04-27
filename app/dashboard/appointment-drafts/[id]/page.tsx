"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  User,
  MapPin,
  ClipboardList,
  UserCheck,
  Clock,
  Activity,
  Stethoscope,
  Settings2,
  CalendarDays,
  Tag,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import type { AppointmentDraft } from "@/types/appointment-draft";

/* ── DATA DUMMY LENGKAP (SINKRON DENGAN TABEL DAFTAR) ───────────────────────── */
const MOCK_DETAILS: Record<string, Partial<AppointmentDraft>> = {
  "157": {
    id: "157",
    requestCode: "-",
    status: "APPROVED",
    statusReason: "Dokumen dan jadwal telah diverifikasi oleh tim medis",
    lastStep: "Draft Initialized",
    createdAt: "2026-04-20T08:00:00.000Z",
    updatedAt: "2026-04-20T09:00:00.000Z",
    patient: { name: "Yosua Satrio Wicaksono", gender: "MALE", age: 28, dateOfBirth: "1997-05-09T00:00:00.000Z" } as any,
    client: { name: "Pasien Jember", phone: "+628172367127", email: "patient1@yopmail.com" },
    location: { address: "Perumahan Bumi Mutiara Blok JK4 No 16, Kec. Bojong Kulur", city: "KAB. BOGOR", province: "JAWA BARAT", postalCode: "16968" },
    service: { 
      name: "FISIOHOME", 
      schedule: "2026-04-20T09:00:00.000Z", 
      package: { name: "Basic Visit", numberOfVisit: 1 } 
    },
    pic: { name: "Yosua Satrio Wicaksono", email: "yosua@fisiohome.id" } as any,
    medicalRecord: { condition: "NORMAL", history: "N/A", onsetDate: "N/A", complaint: "Gak mood" },
    additionalSettings: { referralSource: "WhatsApp", partnerName: "-", isPartnerBooking: false }
  },
  "158": {
    id: "158",
    requestCode: "KA50505",
    status: "PENDING",
    statusReason: "Menunggu konfirmasi pembayaran dari pihak bank",
    lastStep: "Draft Initialized",
    createdAt: "2026-04-20T06:00:00.000Z",
    updatedAt: "2026-04-20T07:00:00.000Z",
    patient: { name: "Said", gender: "MALE", age: 28, dateOfBirth: "1997-05-14T00:00:00.000Z" } as any, 
    client: { name: "Said", phone: "+6287766556655", email: "said@fisiohome.id" },
    location: { address: "Green Pramuka City, Jakarta Pusat", city: "KOTA ADM. JAKARTA PUSAT", province: "DKI Jakarta", postalCode: "10570" },
    service: { 
      name: "FISIOHOME SPECIAL TIER", 
      schedule: "2026-04-20T07:00:00.000Z", 
      package: { name: "Special Tier", numberOfVisit: 1 } 
    },
    pic: { name: "Tech Admin", email: "tech@fisiohome.id" } as any,
    medicalRecord: { condition: "NORMAL", history: "N/A", onsetDate: "N/A", complaint: "pegal-pegal" },
    additionalSettings: { referralSource: "Instagram", partnerName: "-", isPartnerBooking: false }
  },
  "159": {
    id: "159",
    requestCode: "KA50509",
    status: "IN_PROGRESS",
    statusReason: "Admin sedang melengkapi data pengaturan tambahan",
    lastStep: "additional_settings",
    createdAt: "2026-04-22T08:30:00.000Z",
    updatedAt: "2026-04-22T09:00:00.000Z",
    patient: { name: "Said", gender: "MALE", age: 28, dateOfBirth: "1997-05-14T00:00:00.000Z" } as any,
    client: { name: "Said", phone: "+6287766556655", email: "said@fisiohome.id" },
    location: { address: "Green Pramuka City, Jakarta Pusat", city: "KOTA ADM. JAKARTA PUSAT", province: "DKI Jakarta", postalCode: "10570" },
    service: { 
      name: "FISIOHOME SPECIAL TIER", 
      schedule: "2026-04-22T09:00:00.000Z", 
      package: { name: "Special Tier", numberOfVisit: 1 } 
    },
    pic: { name: "Tech Admin", email: "tech@fisiohome.id" } as any,
    medicalRecord: { condition: "NORMAL", history: "N/A", onsetDate: "N/A", complaint: "pusing" },
    additionalSettings: { referralSource: "Facebook", partnerName: "-", isPartnerBooking: true }
  },
  "3799": {
    id: "3799",
    requestCode: "-",
    status: "EXPIRED",
    statusReason: "Batas waktu pengisian data berakhir (24 jam tanpa aktivitas)",
    lastStep: "additional_settings",
    createdAt: "2026-04-27T10:00:00.000Z",
    updatedAt: "2026-04-27T16:00:00.000Z",
    expiredAt: "2026-04-28T10:00:00.000Z",
    patient: { name: "Andrea Hanna Rininditia", gender: "FEMALE", age: 25, dateOfBirth: "2000-05-10T17:00:00.000Z" } as any,
    client: { name: "Yonathan Adi Prasetya", phone: "+6285779737733", email: "deahnnr@gmail.com" },
    location: { address: "Batavia Apartment Tower 2 Unit 10-01", city: "KOTA ADM. JAKARTA PUSAT", province: "-", postalCode: "-" },
    service: { 
      name: "PERAWAT HOMECARE", 
      schedule: "2026-04-20T09:00:00.000Z", 
      package: { name: "Super Move Booster", numberOfVisit: 1 } 
    },
    pic: { name: "Maria Nareva Hayundia", email: "narevahmp@gmail.com" } as any,
    medicalRecord: { condition: "NORMAL", history: "Gerd", onsetDate: "N/A", complaint: "Badan lemas dan terasa ngilu" },
    additionalSettings: { referralSource: "Instagram", voucherCode: "HEAL2026", isPartnerBooking: false }
  }
};

/* ── MAIN PAGE COMPONENT ────────────────────────────────────────────── */
export default function DraftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [draft, setDraft] = useState<AppointmentDraft | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LANGSUNG AMBIL DARI DUMMY DATA
    const data = MOCK_DETAILS[id] as AppointmentDraft | undefined;
    setDraft(data || null);
    setLoading(false);
  }, [id]);

  if (loading) return <DetailPageSkeleton />;

  if (!draft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <ClipboardList className="h-12 w-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Draft Tidak Ditemukan</h2>
        <Button variant="outline" onClick={() => router.back()}>Kembali ke Daftar</Button>
      </div>
    );
  }

  const rawOnset = draft.medicalRecord?.onsetDate;
  const formattedOnset = (rawOnset && rawOnset !== "N/A" && rawOnset !== "") 
    ? format(new Date(rawOnset), "dd MMM yyyy") 
    : "N/A";

  const displayRequestCode = draft.requestCode !== "-" ? draft.requestCode : `ID-${draft.id}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Navigation & CreatedAt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-3">
        <Button variant="ghost" onClick={() => router.back()} className="pl-0 text-slate-600 group hover:bg-transparent hover:text-[#6200EE] w-fit">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar
        </Button>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <CalendarDays className="h-3.5 w-3.5 text-[#6200EE]" />
          Created: {format(new Date(draft.createdAt), "dd MMM yyyy, HH:mm")}
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#6200EE] to-[#9747FF] p-6 md:p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,#fff_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 p-8 opacity-10">
          <ClipboardList className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 group/copy">
              <h1 className="text-3xl font-black tracking-tight">{displayRequestCode}</h1>
              <CopyButton value={displayRequestCode} className="opacity-0 group-hover/copy:opacity-100 transition-opacity text-white/70 hover:text-white hover:bg-white/20" />
            </div>
            
            <div className="flex items-center gap-2 group/copy">
              <p className="text-white/60 text-xs font-mono">Draft ID: {draft.id}</p>
              <CopyButton value={draft.id} className="opacity-0 group-hover/copy:opacity-100 transition-opacity text-white/50 hover:text-white hover:bg-white/20 h-4 w-4 p-0.5" />
            </div>

            <div className="pt-1">
              <StatusBadge status={draft.status} />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[240px] text-right">
            <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mb-1">Tahapan Saat Ini</p>
            <p className="text-xl font-bold capitalize">{draft.lastStep.replace(/_/g, " ")}</p>
            <div className="flex items-center justify-end gap-1.5 text-white/70 text-[10px] mt-2 font-medium">
              <Clock className="h-3 w-3" />
              Pembaruan: {format(new Date(draft.updatedAt), "dd MMM yyyy, HH:mm")}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <SectionCard icon={<User className="h-5 w-5" />} iconBg="bg-indigo-50 text-indigo-600" title="Informasi Pasien & Klien">
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

            <div className="mt-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Pasien (Basic)</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <InfoItem label="Full Name" value={draft.patient.name} />
              <InfoItem label="Gender" value={draft.patient.gender} capitalize />
              <InfoItem label="Age" value={draft.patient.age ? `${draft.patient.age} Tahun` : "-"} />
              <InfoItem label="Date of Birth" value={draft.patient.dateOfBirth ? format(new Date(draft.patient.dateOfBirth), "dd MMM yyyy") : "-"} />
            </div>

            <Separator className="my-6" />

            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="h-4 w-4 text-purple-500" />
              <div className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Medical Record</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-purple-50/40 p-5 rounded-2xl border border-purple-100/50">
              <InfoItem label="Patient Condition" value={draft.medicalRecord?.condition} />
              <InfoItem label="Illness Onset Date" value={formattedOnset} />
              <div className="col-span-1 sm:col-span-2">
                <InfoItem label="Medical History" value={draft.medicalRecord?.history || "N/A"} span />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <InfoItem label="Complaint Description" value={draft.medicalRecord?.complaint || "N/A"} span />
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={<Settings2 className="h-5 w-5" />} iconBg="bg-blue-50 text-blue-600" title="Informasi & Pengaturan Tambahan">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
              <InfoItem label="Voucher Code" value={draft.additionalSettings.voucherCode} />
              <InfoItem label="Referral Source" value={draft.additionalSettings.referralSource} />
              <InfoItem label="Custom Referral" value={draft.additionalSettings.customReferralSource} />
              <InfoItem label="Partner Name" value={draft.additionalSettings.partnerName} />
              <InfoItem label="Is Partner Booking?" value={draft.additionalSettings.isPartnerBooking ? "YES" : "NO"} />
            </div>
          </SectionCard>

          <SectionCard icon={<MapPin className="h-5 w-5" />} iconBg="bg-rose-50 text-rose-600" title="Detail Lokasi">
            <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">{draft.location.address}</p>
            <div className="flex flex-wrap gap-2">
              {draft.location.city !== "-" && <Badge variant="secondary" className="bg-slate-100 text-slate-600">{draft.location.city}</Badge>}
              {draft.location.province !== "-" && <Badge variant="secondary" className="bg-slate-100 text-slate-600">{draft.location.province}</Badge>}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard icon={<Activity className="h-5 w-5" />} iconBg="bg-amber-100 text-amber-600" title="Informasi Status">
             <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Catatan Terakhir</p>
                  <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-xl px-4 py-3 text-sm leading-relaxed italic">
                    "{draft.statusReason || "Tidak ada rincian tambahan."}"
                  </div>
                </div>
                {draft.status === "EXPIRED" && draft.expiredAt && (
                   <div className="flex items-center gap-2 text-rose-700 font-bold text-xs bg-rose-50 p-3 rounded-xl border border-rose-200">
                     <Clock className="h-4 w-4 shrink-0" />
                     Expired At: {format(new Date(draft.expiredAt), "dd MMM yyyy, HH:mm")}
                   </div>
                )}
              </div>
          </SectionCard>

          <div className="bg-[#6200EE] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <Activity className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5 rotate-12" />
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-1">Layanan</p>
                <h3 className="text-xl font-black">{draft.service.name}</h3>
              </div>
              
              {draft.service.package && (
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Tag className="h-3.5 w-3.5 text-white/60" />
                    <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Detail Paket</p>
                  </div>
                  <p className="font-bold text-lg leading-tight mb-2">{draft.service.package.name}</p>
                  <Badge className="bg-white text-[#6200EE] hover:bg-white/90 font-black border-none text-[10px]">
                    {draft.service.package.numberOfVisit} VISIT
                  </Badge>
                </div>
              )}

              <Separator className="bg-white/20" />
              
              <div className="space-y-2">
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
            </div>
          </div>

          <SectionCard icon={<UserCheck className="h-5 w-5" />} iconBg="bg-teal-100 text-teal-600" title="Admin PIC">
             <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-bold shrink-0">
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
    EXPIRED: "bg-rose-600 text-white border-rose-700",
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