"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  User,
  MapPin,
  Package,
  Phone,
  Clock,
  Receipt,
  Stethoscope,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  FileText,
  Camera,
  AlertCircle,
  Hash,
  Tag,
  Percent,
  Wallet,
  Activity,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  Mail,
} from "lucide-react";
import { fetchOrderById } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Therapist {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  registration_number: string;
  gender: string;
  batch: number;
  specializations: string[];
  modalities: string[];
  employment_type: string;
  employment_status: string;
  therapist_type: string;
}

interface Address {
  address_line: string;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  notes: string | null;
}

interface Soap {
  id: number;
  subject: string;
  objective: string;
  assessment: string;
  planning: string;
  additional_notes: string;
  is_complete: boolean;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

interface EvidencePhoto {
  id: number;
  photo_type: string;
  photo_url: string;
  created_at: string;
}

interface Evidence {
  id: number;
  latitude: number;
  longitude: number;
  photos: EvidencePhoto[];
  created_at: string;
}

interface Visit {
  id: string;
  visit_number: number;
  status: string;
  appointment_date_time: string;
  therapist: Therapist;
  address: Address;
  is_soap_exists: boolean;
  soap?: Soap;
  is_evidence_exists: boolean;
  evidence?: Evidence;
}

interface Order {
  id: string;
  registration_number: string;
  status: string;
  payment_status: string;
  package_base_price: number;
  subtotal: number;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
  voucher_code: string | null;
  tax_percentage: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  invoice_number: string | null;
  invoice_url: string | null;
  invoice_due_date: string | null;
  user: { id: string; email: string; phone: string | null; is_admin: boolean };
  patient: { id: string; name: string; date_of_birth: string; gender: string };
  package: {
    id: number;
    name: string;
    total_visits: number;
    price_per_visit: number;
  };
  service: { id: number; name: string };
  visits: Visit[];
  payments: any[];
  has_feedback: boolean;
  special_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{
    photos: EvidencePhoto[];
    index: number;
  } | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetchOrderById(id);
        setOrder(res?.data ?? res);
      } catch (error: any) {
        toast.error("Gagal memuat detail order", {
          description: error?.message || "Terjadi kesalahan sistem.",
        });
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) return <DetailPageSkeleton />;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground mb-4">Order tidak ditemukan.</p>
        <Button onClick={() => router.back()}>Kembali</Button>
      </div>
    );
  }

  const sortedVisits = [...order.visits].sort(
    (a, b) => a.visit_number - b.visit_number,
  );
  const completedVisits = sortedVisits.filter(
    (v) => v.status === "COMPLETED",
  ).length;
  const progressPercent =
    order.package.total_visits > 0
      ? Math.round((completedVisits / order.package.total_visits) * 100)
      : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dt: string) =>
    format(new Date(dt), "dd MMM yyyy, HH:mm", { locale: idLocale });

  const uniqueTherapists = Array.from(
    new Map(sortedVisits.map((v) => [v.therapist.id, v.therapist])).values(),
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* ── Top Nav ── */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          className="pl-0 hover:bg-transparent hover:text-[#6200EE] group text-slate-600"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Order
        </Button>
        <div className="text-xs text-slate-400">
          Last updated: {order.updated_at ? formatDate(order.updated_at) : "-"}
        </div>
      </div>

      {/* ── Hero Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#6200EE] via-[#7722FF] to-[#9747FF] p-6 md:p-8 text-white shadow-lg shadow-purple-200">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#fff_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 right-0 p-8 opacity-10">
          <Activity className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {order.registration_number}
              </h1>
              <StatusBadge status={order.status} />
              <PaymentBadge status={order.payment_status} />
            </div>
            <p className="text-white/70 font-mono text-xs">{order.id}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20 shrink-0">
            <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
              Session Progress
            </p>
            <p className="text-2xl font-bold">
              {completedVisits}
              <span className="text-lg font-normal text-white/60">
                {" "}
                / {order.package.total_visits}
              </span>
            </p>
            <Progress
              value={progressPercent}
              className="h-1.5 bg-white/20 mt-2"
            />
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient */}
          <SectionCard title="Informasi Pasien">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InfoItem label="Nama Lengkap" value={order.patient.name} span />
              <InfoItem
                label="Jenis Kelamin"
                value={
                  order.patient.gender === "FEMALE" ? "Perempuan" : "Laki-laki"
                }
              />
              <InfoItem
                label="Tanggal Lahir"
                value={format(
                  new Date(order.patient.date_of_birth),
                  "dd MMM yyyy",
                  {
                    locale: idLocale,
                  },
                )}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                <Mail className="h-3 w-3" />
                {order.user.email}
              </div>
              {order.user.phone && (
                <div className="flex items-center gap-1.5 text-xs text-[#6200EE] bg-purple-50 px-2.5 py-1 rounded-full font-medium">
                  <Phone className="h-3 w-3" />
                  {order.user.phone}
                </div>
              )}
            </div>
          </SectionCard>

          {/* Therapists */}
          <SectionCard title="Terapis">
            <div className="space-y-5">
              {uniqueTherapists.map((therapist, i) => (
                <div key={therapist.id}>
                  {i > 0 && <Separator className="mb-5" />}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                      <Stethoscope className="h-6 w-6 text-teal-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-base font-bold text-slate-900">
                          {therapist.full_name}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs text-slate-500 border-slate-200"
                        >
                          {therapist.registration_number}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${
                            therapist.employment_status === "ACTIVE"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {therapist.employment_status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-500 mb-2">
                        <span className="capitalize">
                          {therapist.gender.toLowerCase()}
                        </span>
                        <span>·</span>
                        <span>Batch {therapist.batch}</span>
                        <span>·</span>
                        <span>{therapist.employment_type}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <a
                          href={`tel:${therapist.phone_number}`}
                          className="flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full"
                        >
                          <Phone className="h-3 w-3" />
                          {therapist.phone_number}
                        </a>
                        <a
                          href={`mailto:${therapist.email}`}
                          className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full"
                        >
                          <Mail className="h-3 w-3" />
                          {therapist.email}
                        </a>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {therapist.specializations.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-xs text-slate-400 uppercase tracking-wide mr-1">
                              Spesialisasi
                            </span>
                            {therapist.specializations.map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 text-xs"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {therapist.modalities.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-xs text-slate-400 uppercase tracking-wide mr-1">
                              Modalitas
                            </span>
                            {therapist.modalities.map((m) => (
                              <Badge
                                key={m}
                                variant="secondary"
                                className="bg-orange-50 text-orange-700 text-xs"
                              >
                                {m}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Location */}
          <SectionCard title="Lokasi Layanan">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-3">
              {sortedVisits[0]?.address?.address_line || "-"}
            </p>
            <div className="flex flex-wrap gap-2">
              {sortedVisits[0]?.address?.postal_code && (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600"
                >
                  {sortedVisits[0].address.postal_code}
                </Badge>
              )}
            </div>
            {sortedVisits[0]?.address?.notes && (
              <p className="text-xs text-slate-400 mt-2 italic">
                {sortedVisits[0].address.notes}
              </p>
            )}
          </SectionCard>

          {/* Visits */}
          <SectionCard title="Daftar Kunjungan">
            <div className="space-y-2">
              {sortedVisits.map((visit) => (
                <VisitRow
                  key={visit.id}
                  visit={visit}
                  isExpanded={expandedVisit === visit.id}
                  onToggle={() =>
                    setExpandedVisit(
                      expandedVisit === visit.id ? null : visit.id,
                    )
                  }
                  formatDate={formatDate}
                  onOpenLightbox={(photos, index) =>
                    setLightbox({ photos, index })
                  }
                />
              ))}
            </div>
          </SectionCard>

          {/* Special Notes */}
          {order.special_notes && (
            <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  Catatan Khusus
                </p>
                <p className="text-sm text-amber-700">{order.special_notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT ── */}
        <div className="space-y-6">
          {/* Service summary (purple card) */}
          <div className="rounded-3xl bg-[#6200EE] text-white overflow-hidden relative shadow-lg shadow-purple-200">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Activity className="h-28 w-28 rotate-12" />
            </div>
            <div className="relative z-10 p-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Layanan
              </p>
              <p className="text-2xl font-extrabold leading-tight">
                {order.service.name}
              </p>
              <Separator className="bg-white/20" />
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-white/70" />
                <p className="text-base font-semibold">{order.package.name}</p>
              </div>
              <p className="text-white/60 text-xs">
                {order.package.total_visits} kunjungan ·{" "}
                {formatCurrency(order.package.price_per_visit)}/kunjungan
              </p>

              {/* Pricing breakdown */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/70 flex items-center gap-1">
                      <Tag className="h-3 w-3" /> Diskon
                      {order.voucher_code && (
                        <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded ml-1">
                          {order.voucher_code}
                        </span>
                      )}
                    </span>
                    <span className="text-green-300">
                      -{formatCurrency(order.discount_amount)}
                    </span>
                  </div>
                )}
                {order.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/70 flex items-center gap-1">
                      <Percent className="h-3 w-3" /> Pajak (
                      {order.tax_percentage}
                      %)
                    </span>
                    <span>{formatCurrency(order.tax_amount)}</span>
                  </div>
                )}
                <Separator className="bg-white/20 my-1" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <SectionCard
            title="Pembayaran"
            badge={<PaymentBadge status={order.payment_status} />}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Wallet className="h-4 w-4" /> Sudah Dibayar
                </span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(order.paid_amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Sisa Tagihan
                </span>
                <span className="font-semibold text-red-500">
                  {formatCurrency(order.remaining_amount)}
                </span>
              </div>
              {order.invoice_number && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Hash className="h-4 w-4" /> No. Invoice
                    </span>
                    <span className="font-mono font-medium text-slate-700">
                      {order.invoice_number}
                    </span>
                  </div>
                  {order.invoice_due_date && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Jatuh Tempo</span>
                      <span className="font-medium text-slate-700">
                        {formatDate(order.invoice_due_date)}
                      </span>
                    </div>
                  )}
                  {order.invoice_url && (
                    <a
                      href={order.invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="w-full mt-1 rounded-xl text-[#6200EE] border-[#6200EE]/30 hover:bg-purple-50"
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Lihat Invoice
                      </Button>
                    </a>
                  )}
                </>
              )}
            </div>
          </SectionCard>

          {/* Meta */}
          <div className="text-xs text-slate-400 space-y-1 px-1">
            <p>
              Dibuat: {order.created_at ? formatDate(order.created_at) : "-"}
            </p>
            <p>
              Diperbarui:{" "}
              {order.updated_at ? formatDate(order.updated_at) : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onChange={(i) => setLightbox({ ...lightbox, index: i })}
        />
      )}
    </div>
  );
}

// ─── Visit Row ────────────────────────────────────────────────────────────────

function VisitRow({
  visit,
  isExpanded,
  onToggle,
  formatDate,
  onOpenLightbox,
}: {
  visit: Visit;
  isExpanded: boolean;
  onToggle: () => void;
  formatDate: (dt: string) => string;
  onOpenLightbox: (photos: EvidencePhoto[], index: number) => void;
}) {
  const isCompleted = visit.status === "COMPLETED";

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isCompleted
          ? "border-green-100 bg-green-50/40"
          : "border-slate-100 bg-white"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50/60 transition-colors"
      >
        <div className="shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : visit.status === "CANCELLED" ? (
            <AlertCircle className="h-5 w-5 text-red-400" />
          ) : (
            <Circle className="h-5 w-5 text-slate-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold text-slate-700">
              Kunjungan #{visit.visit_number}
            </span>
            <VisitStatusBadge status={visit.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(visit.appointment_date_time)}
            </span>
            <span className="flex items-center gap-1 truncate">
              <Stethoscope className="h-3 w-3 shrink-0" />
              {visit.therapist.full_name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {visit.is_soap_exists && (
            <span title="SOAP tersedia">
              <FileText className="h-4 w-4 text-blue-400" />
            </span>
          )}
          {visit.is_evidence_exists && (
            <span title="Bukti tersedia">
              <Camera className="h-4 w-4 text-purple-400" />
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 p-4 space-y-4">
          {/* Therapist */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Terapis
            </p>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                <Stethoscope className="h-4 w-4 text-teal-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {visit.therapist.full_name}
                </p>
                <p className="text-xs text-slate-400">
                  {visit.therapist.registration_number} · Batch{" "}
                  {visit.therapist.batch}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {visit.therapist.specializations.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="text-xs bg-blue-50 text-blue-700"
                    >
                      {s}
                    </Badge>
                  ))}
                  {visit.therapist.modalities.map((m) => (
                    <Badge
                      key={m}
                      variant="secondary"
                      className="text-xs bg-orange-50 text-orange-700"
                    >
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SOAP */}
          {visit.is_soap_exists && visit.soap && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Catatan SOAP
                  </p>
                  {visit.soap.is_complete ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 border-green-200 text-xs"
                    >
                      Selesai {visit.soap.completion_percentage}%
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-700 border-amber-200 text-xs"
                    >
                      {visit.soap.completion_percentage}% selesai
                    </Badge>
                  )}
                </div>
                <div className="space-y-3">
                  <SoapField
                    label="S – Subjektif"
                    value={visit.soap.subject}
                    color="bg-blue-50 border-blue-200 text-blue-800"
                  />
                  <SoapField
                    label="O – Objektif"
                    value={visit.soap.objective}
                    color="bg-violet-50 border-violet-200 text-violet-800"
                  />
                  <SoapField
                    label="A – Assessment"
                    value={visit.soap.assessment}
                    color="bg-orange-50 border-orange-200 text-orange-800"
                  />
                  <SoapField
                    label="P – Planning"
                    value={visit.soap.planning}
                    color="bg-teal-50 border-teal-200 text-teal-800"
                  />
                  {visit.soap.additional_notes && (
                    <SoapField
                      label="Catatan Tambahan"
                      value={visit.soap.additional_notes}
                      color="bg-slate-50 border-slate-200 text-slate-700"
                    />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Dibuat {format(new Date(visit.soap.created_at), "PPP p")}
                </p>
              </div>
            </>
          )}

          {/* Evidence */}
          {visit.is_evidence_exists && visit.evidence && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Bukti Kunjungan
                </p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {visit.evidence.photos.map((photo, idx) => (
                    <button
                      key={photo.id}
                      onClick={() =>
                        onOpenLightbox(visit.evidence!.photos, idx)
                      }
                      className="group block text-left"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-[#6200EE] transition-colors">
                        <img
                          src={photo.photo_url}
                          alt={photo.photo_type}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 capitalize">
                        {photo.photo_type}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="h-3 w-3" />
                  {visit.evidence.latitude.toFixed(6)},{" "}
                  {visit.evidence.longitude.toFixed(6)}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  photos,
  index,
  onClose,
  onChange,
}: {
  photos: EvidencePhoto[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const photo = photos[index];
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onChange(index - 1);
      if (e.key === "ArrowRight" && hasNext) onChange(index + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, hasPrev, hasNext]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm">
        {index + 1} / {photos.length}
      </div>

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={() => onChange(index - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center">
        <img
          src={photo.photo_url}
          alt={photo.photo_type}
          className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
        />
      </div>

      {/* Next */}
      {hasNext && (
        <button
          onClick={() => onChange(index + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm text-white text-xs px-5 py-2.5 rounded-full">
        <span className="font-medium capitalize">{photo.photo_type}</span>
        <span className="text-white/50">·</span>
        <span className="text-white/70">
          {format(new Date(photo.created_at), "dd MMM yyyy, HH:mm")}
        </span>
        <a
          href={photo.photo_url}
          download
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
      </div>
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────

function SectionCard({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {badge}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  span,
}: {
  label: string;
  value?: string;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2 sm:col-span-1" : ""}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800">{value || "-"}</p>
    </div>
  );
}

function SoapField({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div
        className={`rounded-xl px-4 py-3 border text-sm leading-relaxed whitespace-pre-line ${color}`}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
    DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
    PENDING_PAYMENT: "bg-amber-100 text-amber-700 border-amber-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
    MATCHING_THERAPIST: "bg-purple-100 text-purple-700 border-purple-200",
  };
  return (
    <Badge
      variant="outline"
      className={`font-bold px-3 py-1 rounded-full border ${
        styles[status] || "bg-slate-100 text-slate-700"
      } ${className || ""}`}
    >
      {status?.replace(/_/g, " ") || "UNKNOWN"}
    </Badge>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-green-100 text-green-700 border-green-200",
    UNPAID: "bg-red-100 text-red-700 border-red-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    FAILED: "bg-red-100 text-red-700 border-red-200",
    REFUNDED: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Badge
      variant="outline"
      className={`font-semibold ${
        styles[status] || "bg-slate-50 text-slate-600"
      }`}
    >
      {status}
    </Badge>
  );
}

function VisitStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    SCHEDULED: "bg-blue-100 text-blue-700",
    CANCELLED: "bg-red-100 text-red-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status?.replace(/_/g, " ")}
    </span>
  );
}

function DetailPageSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Skeleton className="h-8 w-48 rounded-xl" />
      <Skeleton className="h-36 w-full rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
