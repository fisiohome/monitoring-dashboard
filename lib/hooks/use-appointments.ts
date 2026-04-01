"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { fetchAllPages } from "@/lib/export-utils";
import { formatDateFilter } from "@/lib/utils";
import { fetchAppointments, FetchAppointmentsParams } from "@/lib/api";
import { useFilterParams } from "@/lib/hooks/use-filter-params";

export function useAppointments() {
  const { get, getAll, set, clear, searchParams } = useFilterParams();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const page = parseInt(get("page", "1")) || 1;
  const limit = parseInt(get("limit", "10")) || 10;
  const search = get("registration_number");
  const statusFilters = getAll("status");
  const patientNameFilter = get("patient_name");
  const therapistNameFilter = get("therapist_name");
  const therapistTypeFilter = get("therapist_type");
  const patientNumberFilter = get("patient_number");
  const orderIdFilter = get("order_id");
  const dateFilter = get("date");
  const startDateFilter = get("start_date");
  const endDateFilter = get("end_date");
  const isSoapExists = get("soap", "all");
  const isEvidenceExists = get("evidence", "all");
  const sortBy = get("sort_by", "created_at");
  const sortOrder = get("sort_order", "desc");

  const getFilterParams = (forExport = false): FetchAppointmentsParams => ({
    ...(forExport ? {} : { page, limit }),
    ...(statusFilters.length === 1 && { status: statusFilters[0] }),
    ...(statusFilters.length > 1 && { status: statusFilters.join(",") }),
    ...(patientNameFilter && { patient_name: patientNameFilter }),
    ...(therapistNameFilter && { therapist_name: therapistNameFilter }),
    ...(therapistTypeFilter && {
      therapist_type: therapistTypeFilter as any,
    }),
    ...(patientNumberFilter && { patient_number: patientNumberFilter }),
    ...(orderIdFilter && { order_id: orderIdFilter }),
    ...(search && { registration_number: search }),
    ...(dateFilter && { date: dateFilter }),
    ...(startDateFilter && { start_date: formatDateFilter(startDateFilter) }),
    ...(endDateFilter && { end_date: formatDateFilter(endDateFilter, true) }),
    ...(isSoapExists !== "all" && {
      is_soap_exists: isSoapExists === "true",
    }),
    ...(isEvidenceExists !== "all" && {
      is_evidence_exists: isEvidenceExists === "true",
    }),
    sort_by: sortBy,
    sort_order: sortOrder as any,
  });

  useEffect(() => {
    async function loadAppointments() {
      setLoading(true);
      try {
        const params = getFilterParams();

        const response = await fetchAppointments(params);
        setAppointments(response.appointments ?? []);
        setTotalPages(response.meta?.total_pages ?? 1);
        setTotalItems(response.meta?.total_items ?? 0);
      } catch (error: any) {
        console.error("Failed to load appointments", error);
        toast.error("Gagal memuat data appointments", {
          description: error?.message || "Terjadi kesalahan sistem.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, [searchParams.toString()]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        search ||
        statusFilters.length > 0 ||
        patientNameFilter ||
        therapistNameFilter ||
        therapistTypeFilter ||
        patientNumberFilter ||
        orderIdFilter ||
        dateFilter ||
        startDateFilter ||
        endDateFilter ||
        isSoapExists !== "all" ||
        isEvidenceExists !== "all" ||
        sortBy !== "created_at" ||
        sortOrder !== "desc",
      ),
    [
      search,
      statusFilters,
      patientNameFilter,
      therapistNameFilter,
      therapistTypeFilter,
      patientNumberFilter,
      orderIdFilter,
      dateFilter,
      startDateFilter,
      endDateFilter,
      isSoapExists,
      isEvidenceExists,
      sortBy,
      sortOrder,
    ],
  );

  const handleExportAll = async (
    onProgress?: (progress: number, total: number) => void
  ) => {
    const params = getFilterParams(true);
    return await fetchAllPages(fetchAppointments, params, "appointments", onProgress);
  };

  return {
    appointments,
    loading,
    page,
    limit,
    totalPages,
    totalItems,
    handleExportAll,
    hasActiveFilters,
    setFilters: set,
    clearFilters: clear,
  };
}
