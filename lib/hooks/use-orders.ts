"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchOrders } from "@/lib/api/orders";
import { toast } from "sonner";
import { fetchAllPages } from "@/lib/export-utils";

export function useOrders() {
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const page = parseInt(searchParams.get("page") ?? "1") || 1;
  const pageSize = 10;
  const search = searchParams.get("search") ?? "";
  const statusFilters = searchParams.getAll("status");
  const creatorTypeFilter = searchParams.get("creator_type") ?? "";
  const patientNameFilter = searchParams.get("patient_name") ?? "";
  const registrationNumberFilter =
    searchParams.get("registration_number") ?? "";
  const orderStartDateFilter = searchParams.get("order_start_date") ?? "";
  const orderEndDateFilter = searchParams.get("order_end_date") ?? "";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: pageSize,
          sort_by: "created_at",
          sort_order: "desc",
          ...(statusFilters.length === 1 && { status: statusFilters[0] }),
          ...(statusFilters.length > 1 && { status: statusFilters.join(",") }),
          ...(creatorTypeFilter && { creator_type: creatorTypeFilter }),
          ...(patientNameFilter && { patient_name: patientNameFilter }),
          ...((search || registrationNumberFilter) && {
            registration_number: search || registrationNumberFilter,
          }),
          ...(orderStartDateFilter && {
            order_start_date: orderStartDateFilter,
          }),
          ...(orderEndDateFilter && { order_end_date: orderEndDateFilter }),
        };

        const res = await fetchOrders(params);
        let bookings = Array.isArray(res) ? res : (res.bookings ?? []);
        const total =
          res.meta?.total ??
          res.meta?.total_items ??
          res.total ??
          (Array.isArray(res) ? res.length : 0);

        setOrders(bookings);
        setTotalItems(total);
        setTotalPages(
          (res.meta?.total_pages ?? Math.ceil(total / pageSize)) || 1,
        );
      } catch (error: any) {
        console.error("Failed to fetch orders", error);
        toast.error("Gagal memuat data orders", {
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
      sort_by: "created_at",
      sort_order: "desc",
      ...(statusFilters.length > 0 && { status: statusFilters.join(",") }),
      ...(creatorTypeFilter && { creator_type: creatorTypeFilter }),
      ...(patientNameFilter && { patient_name: patientNameFilter }),
      ...((search || registrationNumberFilter) && {
        registration_number: search || registrationNumberFilter,
      }),
      ...(orderStartDateFilter && { order_start_date: orderStartDateFilter }),
      ...(orderEndDateFilter && { order_end_date: orderEndDateFilter }),
    };
    return await fetchAllPages(fetchOrders, params, "bookings");
  };

  return {
    orders,
    loading,
    page,
    pageSize,
    totalPages,
    totalItems,
    handleExportAll,
  };
}
