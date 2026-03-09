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
  CreditCard,
  Receipt,
} from "lucide-react";
import { fetchOrderById } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (error: any) {
        console.error("Failed to load order detail", error);
        toast.error("Gagal memuat detail order", {
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

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground mb-4">Order not found.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  // Adapt fields from booking/order response
  const {
    customer,
    address,
    service,
    package: pkg,
    status,
    payment_status,
    created_at,
    registration_number,
    total_amount,
    booking_date,
  } = order;

  // Fallback names if nested objects are missing or named differently
  const customerName =
    order.patient?.name ||
    customer?.full_name ||
    customer?.name ||
    order.user?.name ||
    order.user?.email ||
    "Unknown Customer";
  const customerEmail =
    order.patient?.email || customer?.email || order.user?.email || "-";
  const customerPhone =
    order.patient?.phone_number ||
    order.patient?.phone ||
    customer?.phone_number ||
    customer?.phone ||
    order.user?.phone_number;

  const serviceName = service?.name || order.service_name;
  const packageName = pkg?.name || order.package_name;

  // Address fallback
  const displayAddress =
    address || order.location || order.patient?.address || null;

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
          Back to Orders
        </Button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-linear-to-r from-purple-50 to-white p-6 rounded-3xl border border-purple-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-[#6200EE]">
                {registration_number || "Order Details"}
              </h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                ID: {id}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">
              Order Date
            </div>
            <div className="text-slate-900 font-medium">
              {created_at ? format(new Date(created_at), "PPP p") : "-"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Customer & Location */}
        <div className="space-y-8 lg:col-span-2">
          {/* Customer Card */}
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6200EE]/10 flex items-center justify-center text-[#6200EE]">
                  <User className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Customer Information
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
                        {customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Email
                      </p>
                      <p className="text-base font-medium text-slate-900">
                        {customerEmail}
                      </p>
                    </div>
                  </div>

                  {customerPhone && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-[#6200EE] bg-purple-50 w-fit px-3 py-1.5 rounded-full text-sm font-medium">
                        <Phone className="h-3.5 w-3.5" />
                        {customerPhone}
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
                    Service Location
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {displayAddress ? (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-base font-medium text-slate-800 leading-relaxed mb-4">
                      {displayAddress?.address_line ||
                        displayAddress?.address ||
                        "Address details not available"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {displayAddress?.city && (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                          {displayAddress.city}
                        </Badge>
                      )}
                      {displayAddress?.state && (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                          {displayAddress.state}
                        </Badge>
                      )}
                      {displayAddress?.postal_code && (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                          {displayAddress.postal_code}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="hidden sm:block w-32 h-32 bg-slate-100 rounded-xl border border-slate-200 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6200EE_1px,transparent_1px)] bg-size-[8px_8px]"></div>
                    <div className="flex w-full h-full items-center justify-center text-slate-400">
                      <MapPin className="h-8 w-8 opacity-50" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 italic">
                  No location details available.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Service, Payment, Status */}
        <div className="space-y-8">
          {/* Service Info */}
          <Card className="border-none shadow-sm rounded-3xl bg-[#6200EE] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Receipt className="h-32 w-32 rotate-12" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-lg font-bold opacity-90">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                  Service
                </p>
                <p className="text-2xl font-bold">
                  {serviceName?.replace(/_/g, " ") || "No Service"}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                  Package
                </p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-white/80" />
                  <p className="text-lg font-medium">
                    {packageName || "No Package"}
                  </p>
                </div>
              </div>

              {total_amount !== undefined && (
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 mt-4">
                  <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Total Amount
                  </p>
                  <p className="text-2xl font-mono font-bold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(total_amount)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Payment Status
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-600">Status</div>
                <PaymentBadge status={payment_status || "UNPAID"} />
              </div>
            </CardContent>
          </Card>

          {/* Schedule Info if available */}
          {booking_date && (
            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Booking Date
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-[#6200EE]" />
                  <span className="text-lg font-medium text-slate-900">
                    {format(new Date(booking_date), "PPP p")}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
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
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
    PENDING_PAYMENT: "bg-amber-100 text-amber-700 border-amber-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
    MATCHING_THERAPIST: "bg-purple-100 text-purple-700 border-purple-200",
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

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-green-100 text-green-700 border-green-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    FAILED: "bg-red-100 text-red-700 border-red-200",
    REFUNDED: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <Badge
      variant="outline"
      className={`font-semibold ${styles[status] || "bg-slate-50 text-slate-600"}`}
    >
      {status}
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
