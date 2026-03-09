"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Activity,
  Package,
  Briefcase,
  Phone,
  Clock,
  ChevronRight,
} from "lucide-react";
import { fetchAppointmentById } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchAppointmentById(id);
        setAppointment(data);
      } catch (error: any) {
        console.error("Failed to load appointment detail", error);
        toast.error("Gagal memuat detail appointment", {
          description: error?.message || "Terjadi kesalahan sistem.",
        });
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return <DetailPageSkeleton />;
  }

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
    address,
    service_name,
    package_name,
    status,
    appointment_date,
    visit_number,
    total_visits_in_booking,
  } = appointment;

  // Calculate progress percentage
  const progress =
    total_visits_in_booking > 0
      ? (visit_number / total_visits_in_booking) * 100
      : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          className="w-fit pl-0 hover:bg-transparent hover:text-[#6200EE] group"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Appointments
        </Button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-linear-to-r from-purple-50 to-white p-6 rounded-3xl border border-purple-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-[#6200EE]">
                {appointment.registration_number || "Appointment Details"}
              </h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                {id}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">
              Last Updated
            </div>
            <div className="text-slate-900 font-medium">
              {appointment.updated_at
                ? format(new Date(appointment.updated_at), "PPP p")
                : "-"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Patient & Location */}
        <div className="space-y-8 lg:col-span-2">
          {/* Patient Card */}
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6200EE]/10 flex items-center justify-center text-[#6200EE]">
                  <User className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Patient Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Full Name
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {patient?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Gender
                      </p>
                      <p className="text-base font-medium text-slate-900 capitalize">
                        {patient?.gender?.toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Age
                      </p>
                      <p className="text-base font-medium text-slate-900">
                        {patient?.age} Years Old
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Date of Birth
                      </p>
                      <p className="text-base font-medium text-slate-900">
                        {patient?.date_of_birth}
                      </p>
                    </div>
                  </div>

                  {patient?.phone_number && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-[#6200EE] bg-purple-50 w-fit px-3 py-1.5 rounded-full text-sm font-medium">
                        <Phone className="h-3.5 w-3.5" />
                        {patient.phone_number}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Location
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-base font-medium text-slate-800 leading-relaxed mb-4">
                    {address?.address_line}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      {address?.city}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      {address?.state}
                    </Badge>
                    {address?.postal_code && (
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        {address.postal_code}
                      </Badge>
                    )}
                  </div>
                </div>
                {/* Map Placeholder using Image or CSS Pattern */}
                <div className="hidden sm:block w-32 h-32 bg-slate-100 rounded-xl border border-slate-200 flex-shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6200EE_1px,transparent_1px)] [background-size:8px_8px]"></div>
                  <div className="flex w-full h-full items-center justify-center text-slate-400">
                    <MapPin className="h-8 w-8 opacity-50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Service & Status */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm rounded-3xl bg-[#6200EE] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Activity className="h-32 w-32 rotate-12" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-lg font-bold opacity-90">
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                  Service Type
                </p>
                <p className="text-2xl font-bold">
                  {service_name?.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                  Package
                </p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-white/80" />
                  <p className="text-lg font-medium">{package_name}</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium">Session Progress</span>
                  <span className="text-xl font-bold">
                    {visit_number}{" "}
                    <span className="text-sm font-normal text-white/60">
                      / {total_visits_in_booking}
                    </span>
                  </span>
                </div>
                <Progress value={progress} className="h-2 bg-black/20" />
                {/* Note: Standard Progress component might need custom color logic or override via CSS class */}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Visit Schedule
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center bg-purple-50 rounded-2xl w-16 h-16 text-[#6200EE] border border-purple-100">
                  <span className="text-xs font-bold uppercase">
                    {appointment_date
                      ? format(new Date(appointment_date), "MMM")
                      : "-"}
                  </span>
                  <span className="text-xl font-bold">
                    {appointment_date
                      ? format(new Date(appointment_date), "d")
                      : "-"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">
                    Date & Time
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {appointment_date
                      ? format(new Date(appointment_date), "EEEE, MMMM d, yyyy")
                      : "Not Scheduled"}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-slate-600 font-medium">
                    <Clock className="h-4 w-4 text-[#6200EE]" />
                    {appointment_date
                      ? format(new Date(appointment_date), "h:mm a")
                      : "--:--"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
    SCHEDULED: "bg-blue-100 text-blue-700 border-blue-200",
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    UNSCHEDULED: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <Badge
      variant="outline"
      className={`font-bold px-3 py-1 rounded-full border-2 ${styles[status] || "bg-slate-100 text-slate-700"} ${className}`}
    >
      {status?.replace(/_/g, " ") || "UNKNOWN"}
    </Badge>
  );
}

function DetailPageSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Skeleton className="h-20 w-full rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64 md:col-span-2 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-48 md:col-span-2 rounded-3xl" />
      </div>
    </div>
  );
}
