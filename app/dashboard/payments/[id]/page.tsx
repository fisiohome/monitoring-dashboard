"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchOrderById } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Calendar,
  CreditCard,
  User,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadPayment = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderById(id);
        setPayment(data);
      } catch (err: any) {
        console.error("Failed to fetch payment details", err);
        toast.error("Gagal memuat detail payment", {
          description: err?.message || "Terjadi kesalahan sistem.",
        });
        setError("Failed to load payment details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": // Fallthrough
      case "SUCCESS":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING": // Fallthrough
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      case "UNPAID":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6200EE]" />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-slate-900">
          {error || "Payment found"}
        </p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  // Determine the main display amount
  const amount = payment.total_amount || payment.total_price || 0;
  const paymentStatus = payment.payment_status || payment.status || "UNKNOWN";
  const paymentDate = payment.created_at ? new Date(payment.created_at) : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full border-slate-200 bg-white hover:bg-slate-50 hover:text-[#6200EE]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Details</h1>
          <p className="text-slate-500 text-sm">
            ID:{" "}
            <span className="font-mono text-[#6200EE]">
              {payment.registration_number || payment.id}
            </span>
          </p>
        </div>
        <div className="ml-auto">
          <Badge
            variant="outline"
            className={`border-2 ${getStatusColor(paymentStatus)} font-bold px-4 py-1.5 rounded-full text-sm`}
          >
            {paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Transaction Card */}
        <Card className="md:col-span-2 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-purple-100">
            <CardTitle className="flex items-center gap-2 text-[#6200EE]">
              <CreditCard className="h-5 w-5" />
              Transaction Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <span className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">
                Total Amount
              </span>
              <span className="text-4xl font-bold text-slate-900">
                {amount.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </span>
            </div>

            {/* Payment Status Indicator */}
            <div
              className={`flex items-center justify-between p-4 rounded-xl border ${
                ["PAID", "SUCCESS"].includes(paymentStatus)
                  ? "bg-green-50 border-green-100"
                  : ["PENDING", "PENDING_PAYMENT"].includes(paymentStatus)
                    ? "bg-yellow-50 border-yellow-100"
                    : "bg-red-50 border-red-100"
              }`}
            >
              <span className="font-medium text-slate-700">
                Status Pembayaran
              </span>
              <Badge
                className={`text-sm py-1 px-4 ${
                  ["PAID", "SUCCESS"].includes(paymentStatus)
                    ? "bg-green-500 hover:bg-green-600 border-none text-white"
                    : ["PENDING", "PENDING_PAYMENT"].includes(paymentStatus)
                      ? "bg-yellow-500 hover:bg-yellow-600 border-none text-white"
                      : "bg-red-500 hover:bg-red-600 border-none text-white"
                }`}
              >
                {["PAID", "SUCCESS"].includes(paymentStatus)
                  ? "LUNAS"
                  : "BELUM LUNAS"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Payment ID
                </span>
                <p className="font-mono text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  {payment.id}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Payment Method
                </span>
                <p className="font-medium text-slate-900 flex items-center gap-2">
                  {/* Placeholder for method if available, else generic */}
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  {payment.payment_method || "Bank Transfer / VA"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Date & Time
                </span>
                <p className="font-medium text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {paymentDate ? format(paymentDate, "PPP") : "N/A"}
                </p>
                <p className="text-sm text-slate-500 pl-6">
                  {paymentDate ? format(paymentDate, "p") : ""}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status History
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Created at {paymentDate ? format(paymentDate, "Pp") : "-"}
                  </div>
                  {/* Add more history if available */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column Stack */}
        <div className="space-y-6">
          {/* Customer Card */}
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                  {(payment.patient?.name || payment.user?.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {payment.patient?.name || payment.user?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {payment.patient?.type || "Standard Customer"}
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">
                    Contact
                  </span>
                  <p className="text-sm font-medium text-slate-700">
                    {payment.patient?.phone_number ||
                      payment.patient?.phone ||
                      payment.user?.phone_number ||
                      "-"}
                  </p>
                  <p className="text-sm text-slate-500 break-all">
                    {payment.user?.email || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Service Details */}
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                Related Order
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-xs text-blue-600 font-semibold uppercase mb-1">
                  Service Type
                </p>
                <p className="font-bold text-blue-900">
                  {payment.service?.name || "Physiotherapy Session"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Therapist</span>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    {payment.therapist?.photo_url ? (
                      <img
                        src={payment.therapist.photo_url}
                        alt="Therapist"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-3 w-3 text-slate-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {payment.therapist?.name || "Not assigned yet"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">
                  Appointment Schedule
                </span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {payment.appointment_date
                    ? format(new Date(payment.appointment_date), "PP p")
                    : "Not scheduled"}
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full text-[#6200EE] hover:text-purple-700 hover:bg-purple-50 h-8 text-xs"
                onClick={() => router.push(`/dashboard/orders/${payment.id}`)}
              >
                View Order Full Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
