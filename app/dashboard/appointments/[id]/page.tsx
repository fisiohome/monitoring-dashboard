"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlaBadge } from "@/components/shared/sla-badge";
import { CopySoapLink } from "@/components/shared/copy-soap-link";
import { CopyButton } from "@/components/ui/copy-button";
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Activity,
  Package,
  Phone,
  Clock,
  Stethoscope,
  FileText,
  Camera,
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertCircle,
  Star,
  Layers,
  CreditCard,
  UserCheck,
  Zap,
  Mail,
  X,
  ChevronLeft,
  Download,
  ZoomIn,
} from "lucide-react";
import { fetchAppointmentById } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{
    photos: any[];
    index: number;
  } | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchAppointmentById(id);
        setAppointment(data);
      } catch (error: any) {
        toast.error("Gagal memuat detail appointment", {
          description: error?.message || "Terjadi kesalahan sistem.",
        });
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) return <DetailPageSkeleton />;

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground mb-4">Appointment not found.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const {
    patient,
    therapist,
    address,
    location,
    service,
    package: pkg,
    status,
    appointment_date_time,
    visit_number,
    total_visits_in_booking,
    related_appointments,
    soap,
    evidence,
    is_soap_exists,
    is_evidence_exists,
    soap_sla_minutes,
    evidence_sla_minutes,
    is_final_visit,
    preferred_therapist_gender,
    fisiohome_partner_booking,
    status_reason,
    registration_number,
    updated_at,
    created_at,
  } = appointment;

  const progress =
    total_visits_in_booking > 0
      ? (visit_number / total_visits_in_booking) * 100
      : 0;

  // Combine current + related, sorted by visit_number
  const allVisits = [
    { id, visit_number, status, appointment_date_time },
    ...(related_appointments || []),
  ].sort((a: any, b: any) => a.visit_number - b.visit_number);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* ── Top Nav ── */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          className="pl-0 hover:bg-transparent hover:text-[#6200EE] group text-slate-600"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/dashboard/appointments");
            }
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Appointments
        </Button>
        <div className="flex items-center gap-4">
          <CopySoapLink appointmentId={id} className="text-[#6200EE] border-[#6200EE]/30 bg-purple-50/50 hover:bg-purple-100/50" />
          <div className="text-xs text-slate-400">
            Last updated:{" "}
            {updated_at ? format(new Date(updated_at), "PPP p") : "-"}
          </div>
        </div>
      </div>

      {/* ── Hero Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-[#6200EE] via-[#7722FF] to-[#9747FF] p-6 md:p-8 text-white shadow-lg shadow-purple-200">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,#fff_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 p-8 opacity-10">
          <Activity className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="flex items-center gap-2 group/copy">
                <h1 className="text-3xl font-bold tracking-tight">
                  {registration_number || "Appointment Details"}
                </h1>
                {registration_number && (
                  <CopyButton
                    value={registration_number}
                    className="opacity-0 group-hover/copy:opacity-100 transition-opacity text-white/70 hover:text-white hover:bg-white/20"
                  />
                )}
              </div>
              <StatusBadge status={status} />
              {is_final_visit && (
                <Badge className="bg-yellow-400 text-yellow-900 border-0 font-bold">
                  Final Visit
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 group/copy">
              <p className="text-white/70 font-mono text-xs">{id}</p>
              <CopyButton
                value={id}
                className="opacity-0 group-hover/copy:opacity-100 transition-opacity text-white/50 hover:text-white hover:bg-white/20 h-5 w-5 p-0.5"
              />
            </div>
            {fisiohome_partner_booking && (
              <Badge className="mt-2 bg-white/20 text-white border-white/30 text-xs">
                Partner Booking
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
              <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                Session Progress
              </p>
              <p className="text-2xl font-bold">
                {visit_number}
                <span className="text-lg font-normal text-white/60">
                  {" "}
                  / {total_visits_in_booking}
                </span>
              </p>
              <Progress value={progress} className="h-1.5 bg-white/20 mt-2" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Patient + Location + Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient */}
          <SectionCard
            icon={<User className="h-5 w-5" />}
            iconBg="bg-[#6200EE]/10 text-[#6200EE]"
            title="Patient Information"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InfoItem label="Full Name" value={patient?.name} span />
              <InfoItem label="Gender" value={patient?.gender} capitalize />
              <InfoItem
                label="Age"
                value={patient?.age ? `${patient.age} years` : "-"}
              />
              <InfoItem label="Date of Birth" value={patient?.date_of_birth} />
              <InfoItem
                label="Preferred Therapist"
                value={preferred_therapist_gender || "-"}
                capitalize
              />
            </div>
            {patient?.contact?.contact_phone && (
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-[#6200EE] bg-purple-50 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Phone className="h-3.5 w-3.5" />
                  {patient.contact.contact_phone}
                </div>
                {patient.contact.contact_name &&
                  patient.contact.contact_name !== ";" && (
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full text-sm">
                      <User className="h-3.5 w-3.5" />
                      {patient.contact.contact_name}
                    </div>
                  )}
              </div>
            )}
          </SectionCard>

          {/* Therapist */}
          <SectionCard
            icon={<UserCheck className="h-5 w-5" />}
            iconBg="bg-teal-100 text-teal-600"
            title="Therapist"
          >
            {therapist ? (
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Avatar placeholder */}
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                  <UserCheck className="h-7 w-7 text-teal-500" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-lg font-bold text-slate-900">
                      {therapist.full_name}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs text-slate-500 border-slate-200"
                    >
                      {therapist.registration_number}
                    </Badge>
                    <Badge
                      className={`text-xs font-medium ${
                        therapist.employment_status === "ACTIVE"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                      variant="outline"
                    >
                      {therapist.employment_status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-500 mb-3">
                    {therapist.gender && (
                      <>
                        <span className="capitalize">
                          {therapist.gender.toLowerCase()}
                        </span>
                        <span>·</span>
                      </>
                    )}
                    {therapist.batch && (
                      <>
                        <span>Batch {therapist.batch}</span>
                        <span>·</span>
                      </>
                    )}
                    {therapist.employment_type && (
                      <>
                        <span>{therapist.employment_type}</span>
                        <span>·</span>
                      </>
                    )}
                    {therapist.therapist_type && (
                      <span className="capitalize">
                        {therapist.therapist_type}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {therapist.phone_number && (
                      <a
                        href={`tel:${therapist.phone_number}`}
                        className="flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full"
                      >
                        <Phone className="h-3 w-3" />
                        {therapist.phone_number}
                      </a>
                    )}
                    {therapist.email && (
                      <a
                        href={`mailto:${therapist.email}`}
                        className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full"
                      >
                        <Mail className="h-3 w-3" />
                        {therapist.email}
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {therapist.specializations?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-xs text-slate-400 uppercase tracking-wide mr-1">
                          Specializations
                        </span>
                        {therapist.specializations.map((s: string) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 text-xs capitalize"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {therapist.modalities?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-xs text-slate-400 uppercase tracking-wide mr-1">
                          Modalities
                        </span>
                        {therapist.modalities.map((m: string) => (
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
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <UserCheck className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  No Therapist Assigned
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-[250px]">
                  A therapist has not been assigned to this appointment yet.
                </p>
              </div>
            )}
          </SectionCard>

          {/* Location */}
          <SectionCard
            icon={<MapPin className="h-5 w-5" />}
            iconBg="bg-red-100 text-red-500"
            title="Location"
          >
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-3">
              {address?.address_line}
            </p>
            <div className="flex flex-wrap gap-2">
              {location?.city && (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600"
                >
                  {location.city}
                </Badge>
              )}
              {location?.state && (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600"
                >
                  {location.state}
                </Badge>
              )}
              {location?.country && (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600"
                >
                  {location.country}
                </Badge>
              )}
            </div>
            {address?.latitude !== 0 && address?.longitude !== 0 && (
              <p className="text-xs text-slate-400 mt-2">
                {address.latitude}, {address.longitude}
              </p>
            )}
          </SectionCard>

          {/* SOAP Notes */}
          {is_soap_exists && soap ? (
            <SectionCard
              icon={<FileText className="h-5 w-5" />}
              iconBg="bg-indigo-100 text-indigo-600"
              title={
                <div className="flex items-center gap-2">
                  <span>SOAP Notes</span>
                  {soap_sla_minutes !== undefined &&
                    soap_sla_minutes !== null && (
                      <SlaBadge minutes={soap_sla_minutes} label="SOAP" />
                    )}
                </div>
              }
              badge={
                soap.is_complete ? (
                  <Badge
                    className="bg-green-100 text-green-700 border-green-200 text-xs font-medium"
                    variant="outline"
                  >
                    Complete {soap.completion_percentage}%
                  </Badge>
                ) : (
                  <Badge
                    className="bg-amber-100 text-amber-700 border-amber-200 text-xs font-medium"
                    variant="outline"
                  >
                    {soap.completion_percentage}% done
                  </Badge>
                )
              }
            >
              <div className="space-y-4">
                <SoapField
                  label="S – Subjective"
                  value={soap.subject}
                  color="bg-blue-50 border-blue-200 text-blue-800"
                />
                <SoapField
                  label="O – Objective"
                  value={soap.objective}
                  color="bg-violet-50 border-violet-200 text-violet-800"
                />
                <SoapField
                  label="A – Assessment"
                  value={soap.assessment}
                  color="bg-orange-50 border-orange-200 text-orange-800"
                />
                <SoapField
                  label="P – Planning"
                  value={soap.planning}
                  color="bg-teal-50 border-teal-200 text-teal-800"
                />
                {soap.additional_notes && (
                  <SoapField
                    label="Additional Notes"
                    value={soap.additional_notes}
                    color="bg-slate-50 border-slate-200 text-slate-700"
                  />
                )}
                {soap.initial_physical_condition && (
                  <SoapField
                    label="Initial Physical Condition"
                    value={soap.initial_physical_condition}
                    color="bg-slate-50 border-slate-200 text-slate-700"
                  />
                )}
                {soap.therapy_goal_evaluation && (
                  <SoapField
                    label="Therapy Goal Evaluation"
                    value={soap.therapy_goal_evaluation}
                    color="bg-slate-50 border-slate-200 text-slate-700"
                  />
                )}
                {soap.follow_up_therapy_plan && (
                  <SoapField
                    label="Follow Up Therapy Plan"
                    value={soap.follow_up_therapy_plan}
                    color="bg-slate-50 border-slate-200 text-slate-700"
                  />
                )}
                {soap.next_physiotherapy_goals && (
                  <SoapField
                    label="Next Physiotherapy Goals"
                    value={soap.next_physiotherapy_goals}
                    color="bg-slate-50 border-slate-200 text-slate-700"
                  />
                )}
                {soap.therapy_outcome_summary && (
                  <SoapField
                    label="Therapy Outcome Summary"
                    value={soap.therapy_outcome_summary}
                    color="bg-slate-50 border-slate-200 text-slate-700"
                  />
                )}
                {soap.notes && (
                  <SoapField
                    label="Notes"
                    value={soap.notes}
                    color="bg-slate-50 border-slate-200 text-slate-700"
                  />
                )}
                <p className="text-xs text-slate-400">
                  Created {format(new Date(soap.created_at), "PPP p")}
                </p>
              </div>
            </SectionCard>
          ) : (
            <SectionCard
              icon={<FileText className="h-5 w-5" />}
              iconBg="bg-slate-100 text-slate-400"
              title="SOAP Notes"
            >
              <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                <FileText className="h-8 w-8 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-600">Belum Ada Catatan SOAP</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[250px]">Terapis belum mengisi catatan SOAP untuk janji temu ini.</p>
              </div>
            </SectionCard>
          )}

          {/* Evidence */}
          {is_evidence_exists && evidence ? (
            <SectionCard
              icon={<Camera className="h-5 w-5" />}
              iconBg="bg-pink-100 text-pink-600"
              title={
                <div className="flex items-center gap-2">
                  <span>Attendance Evidence</span>
                  {evidence_sla_minutes !== undefined &&
                    evidence_sla_minutes !== null && (
                      <SlaBadge
                        minutes={evidence_sla_minutes}
                        label="Evidence"
                      />
                    )}
                </div>
              }
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {evidence.photos?.map((photo: any, idx: number) => (
                  <button
                    key={photo.id}
                    onClick={() =>
                      setLightbox({ photos: evidence.photos, index: idx })
                    }
                    className="group block text-left"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-[#6200EE] transition-colors">
                      <img
                        src={photo.url}
                        alt={photo.file_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {photo.file_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(photo.file_size / 1024).toFixed(0)} KB
                    </p>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {evidence.latitude.toFixed(6)},{" "}
                  {evidence.longitude.toFixed(6)}
                </span>
                <span className="text-xs text-slate-400 break-all">
                  {evidence.user_agent?.split(" ").slice(0, 4).join(" ")}
                </span>
                <span className="text-xs text-slate-400">
                  Submitted {format(new Date(evidence.created_at), "PPP p")}
                </span>
              </div>
            </SectionCard>
          ) : (
            <SectionCard
              icon={<Camera className="h-5 w-5" />}
              iconBg="bg-slate-100 text-slate-400"
              title="Attendance Evidence"
            >
              <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                <Camera className="h-8 w-8 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-600">Belum Ada Bukti Kehadiran</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[250px]">Terapis belum mengunggah foto bukti kehadiran.</p>
              </div>
            </SectionCard>
          )}
        </div>

        {/* RIGHT: Service + Package + Schedule + Visits */}
        <div className="space-y-6">
          {/* Service & Schedule */}
          <div className="rounded-3xl bg-[#6200EE] text-white overflow-hidden relative shadow-lg shadow-purple-200">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Activity className="h-28 w-28 rotate-12" />
            </div>
            <div className="relative z-10 p-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Service
              </p>
              <div>
                <p className="text-2xl font-extrabold leading-tight">
                  {service?.name}
                </p>
                <p className="text-white/60 text-sm mt-0.5">
                  {service?.description}
                </p>
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-white/70" />
                <p className="text-base font-semibold">{pkg?.name}</p>
              </div>
              {/* Schedule */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2">
                <p className="text-xs uppercase tracking-wider text-white/60">
                  Appointment Date
                </p>
                <p className="text-lg font-bold">
                  {appointment_date_time
                    ? format(
                        new Date(appointment_date_time),
                        "EEEE, d MMMM yyyy",
                      )
                    : "Not Scheduled"}
                </p>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Clock className="h-4 w-4" />
                  {appointment_date_time
                    ? format(new Date(appointment_date_time), "h:mm a")
                    : "--:--"}
                </div>
              </div>

              {/* Progress */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Sessions</span>
                  <span className="text-xl font-bold">
                    {visit_number}
                    <span className="text-sm font-normal text-white/60">
                      {" "}
                      / {total_visits_in_booking}
                    </span>
                  </span>
                </div>
                <Progress value={progress} className="h-2 bg-white/20" />
              </div>

              {status_reason && (
                <div className="bg-white/10 rounded-xl p-3 text-sm text-white/80">
                  <span className="font-semibold text-white">Reason: </span>
                  {status_reason}
                </div>
              )}
            </div>
          </div>

          {/* Package Pricing */}
          {pkg && (
            <SectionCard
              icon={<CreditCard className="h-5 w-5" />}
              iconBg="bg-amber-100 text-amber-600"
              title="Package Details"
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Visits included</span>
                  <span className="font-semibold">{pkg.number_of_visit}x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Price per visit</span>
                  <span className="font-semibold">
                    {formatIDR(pkg.price_per_visit)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Discount</span>
                  <span className="font-semibold text-green-600">
                    - {formatIDR(pkg.discount)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-slate-800">Total Price</span>
                  <span className="text-[#6200EE]">
                    {formatIDR(pkg.total_price)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Fee per visit</span>
                  <span className="font-medium">
                    {formatIDR(pkg.fee_per_visit)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total fee</span>
                  <span className="font-medium">
                    {formatIDR(pkg.total_fee)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Currency: {pkg.currency}
                </p>
              </div>
            </SectionCard>
          )}

          {/* Related Appointments / Visit Timeline */}
          {allVisits.length > 0 && (
            <SectionCard
              icon={<Layers className="h-5 w-5" />}
              iconBg="bg-purple-100 text-[#6200EE]"
              title="All Visits"
            >
              <div className="space-y-2">
                {allVisits.map((v: any) => {
                  const isCurrent = v.id === id;
                  return (
                    <div
                      key={v.id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                        isCurrent
                          ? "bg-[#6200EE]/8 border border-[#6200EE]/20"
                          : "hover:bg-slate-50 cursor-pointer"
                      }`}
                      onClick={() =>
                        !isCurrent &&
                        router.push(`/dashboard/appointments/${v.id}`)
                      }
                    >
                      <VisitStatusIcon status={v.status} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-800">
                            Visit {v.visit_number}
                          </span>
                          {isCurrent && (
                            <Badge className="bg-[#6200EE] text-white text-[10px] px-1.5 py-0 h-4">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {v.appointment_date_time
                            ? format(
                                new Date(v.appointment_date_time),
                                "d MMM yyyy · h:mm a",
                              )
                            : "Not scheduled"}
                        </p>
                      </div>
                      <StatusBadge status={v.status} small />
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {/* Meta */}
          <div className="text-xs text-slate-400 space-y-1 px-1">
            <p>
              Created:{" "}
              {created_at ? format(new Date(created_at), "PPP p") : "-"}
            </p>
            <p>
              Updated:{" "}
              {updated_at ? format(new Date(updated_at), "PPP p") : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Lightbox Modal ── */}
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

// ── Helper Components ──

function Lightbox({
  photos,
  index,
  onClose,
  onChange,
}: {
  photos: any[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const photo = photos[index];
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onChange(index - 1);
      if (e.key === "ArrowRight" && hasNext) onChange(index + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      {/* Close button */}
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
          src={photo.url}
          alt={photo.file_name}
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

      {/* Bottom info bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm text-white text-xs px-5 py-2.5 rounded-full">
        <span className="font-medium truncate max-w-50">{photo.file_name}</span>
        <span className="text-white/50">·</span>
        <span className="text-white/70">
          {(photo.file_size / 1024).toFixed(0)} KB
        </span>
        <a
          href={photo.url}
          download={photo.file_name}
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

function SectionCard({
  icon,
  iconBg,
  title,
  badge,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: React.ReactNode;
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
  capitalize,
  span,
}: {
  label: string;
  value?: string | number;
  capitalize?: boolean;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2 sm:col-span-1" : ""}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p
        className={`text-sm font-semibold text-slate-800 ${capitalize ? "capitalize" : ""}`}
      >
        {value || "-"}
      </p>
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
  small,
}: {
  status: string;
  className?: string;
  small?: boolean;
}) {
  const styles: Record<string, string> = {
    SCHEDULED: "bg-blue-100 text-blue-700 border-blue-200",
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    UNSCHEDULED: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <Badge
      variant="outline"
      className={`font-bold border ${small ? "text-[10px] px-1.5 py-0 h-4" : "px-3 py-1 rounded-full"} ${
        styles[status] || "bg-slate-100 text-slate-700"
      } ${className || ""}`}
    >
      {status?.replace(/_/g, " ") || "UNKNOWN"}
    </Badge>
  );
}

function VisitStatusIcon({ status }: { status: string }) {
  if (status === "COMPLETED")
    return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />;
  if (status === "CANCELLED")
    return <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />;
  return <Circle className="h-4 w-4 text-slate-300 shrink-0" />;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function DetailPageSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Skeleton className="h-8 w-48 rounded-xl" />
      <Skeleton className="h-36 w-full rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}


