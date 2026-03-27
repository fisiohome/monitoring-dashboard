"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchOrders } from "@/lib/api/orders";
import { toast } from "sonner";
import { fetchAllPages } from "@/lib/export-utils";

export function usePayments() {
  const searchParams = useSearchParams();

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const page = parseInt(searchParams.get("page") ?? "1") || 1;
  const pageSize = 10;
  const search = searchParams.get("search") ?? "";
  const paymentStatusFilters = searchParams.getAll("payment_status");
  const patientNameFilter = searchParams.get("patient_name") ?? "";
  const registrationNumberFilter =
    searchParams.get("registration_number") ?? "";
  const orderStartDateFilter = searchParams.get("order_start_date") ?? "";
  const orderEndDateFilter = searchParams.get("order_end_date") ?? "";
  const sortBy = searchParams.get("sort_by") ?? "created_at";
  const sortOrder = searchParams.get("sort_order") ?? "desc";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: pageSize,
          sort_by: sortBy,
          sort_order: sortOrder,
          ...(paymentStatusFilters.length === 1 && {
            payment_status: paymentStatusFilters[0],
          }),
          ...(paymentStatusFilters.length > 1 && {
            payment_status: paymentStatusFilters.join(","),
          }),
          ...(patientNameFilter && { patient_name: patientNameFilter }),
          ...(registrationNumberFilter && {
            registration_number: registrationNumberFilter,
          }),
          ...(orderStartDateFilter && {
            order_start_date: orderStartDateFilter.includes("T") ? orderStartDateFilter : `${orderStartDateFilter.split("T")[0]}T00:00:00Z`,
          }),
          ...(orderEndDateFilter && { order_end_date: orderEndDateFilter.includes("T") ? orderEndDateFilter : `${orderEndDateFilter.split("T")[0]}T23:59:59Z` }),
        };

        const res = await fetchOrders(params);
        let bookings = Array.isArray(res) ? res : (res.bookings ?? []);
        const total =
          res.meta?.total ??
          res.meta?.total_items ??
          res.total ??
          (Array.isArray(res) ? res.length : 0);

        if (search) {
          const lower = search.toLowerCase();
          bookings = bookings.filter(
            (b: any) =>
              (b.patient?.name ?? "").toLowerCase().includes(lower) ||
              (b.user?.email ?? "").toLowerCase().includes(lower) ||
              (b.id ?? "").toLowerCase().includes(lower) ||
              (b.registration_number ?? "").toLowerCase().includes(lower),
          );
        }

        setPayments(bookings);
        setTotalItems(total);
        setTotalPages(
          (res.meta?.total_pages ?? Math.ceil(total / pageSize)) || 1,
        );
      } catch (error: any) {
        console.error("Failed to fetch payments", error);
        toast.error("Gagal memuat data payments", {
          description: error?.message ?? "Terjadi kesalahan sistem.",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchParams.toString()]);

  const handleExportAll = async () => {
    const params: any = {
      sort_by: sortBy,
      sort_order: sortOrder,
      ...(paymentStatusFilters.length > 0 && {
        payment_status: paymentStatusFilters.join(","),
      }),
      ...(patientNameFilter && { patient_name: patientNameFilter }),
      ...(registrationNumberFilter && {
        registration_number: registrationNumberFilter,
      }),
      ...(orderStartDateFilter && { order_start_date: orderStartDateFilter.includes("T") ? orderStartDateFilter : `${orderStartDateFilter.split("T")[0]}T00:00:00Z` }),
      ...(orderEndDateFilter && { order_end_date: orderEndDateFilter.includes("T") ? orderEndDateFilter : `${orderEndDateFilter.split("T")[0]}T23:59:59Z` }),
    };
    return await fetchAllPages(fetchOrders, params, "bookings");
  };

  return {
    payments,
    loading,
    page,
    pageSize,
    totalPages,
    totalItems,
    handleExportAll,
  };
}
