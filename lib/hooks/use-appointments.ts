"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { fetchAllPages } from "@/lib/export-utils";
import { fetchAppointments, FetchAppointmentsParams } from "@/lib/api";
import { useFilterParams } from "@/lib/hooks/use-filter-params";

export function useAppointments() {
  const { get, getAll, set, clear, searchParams } = useFilterParams();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const page = parseInt(get("page", "1")) || 1;
  const pageSize = 10;
  const search = get("search");
  const statusFilters = getAll("status");
  const patientNameFilter = get("patient_name");
  const therapistNameFilter = get("therapist_name");
  const patientNumberFilter = get("patient_number");
  const orderIdFilter = get("order_id");
  const dateFilter = get("date");
  const startDateFilter = get("start_date");
  const endDateFilter = get("end_date");
  const isSoapExists = get("soap", "all");
  const isEvidenceExists = get("evidence", "all");

  useEffect(() => {
    async function loadAppointments() {
      setLoading(true);
      try {
        const params: FetchAppointmentsParams = {
          page,
          page_size: pageSize,
          ...(statusFilters.length === 1 && { status: statusFilters[0] }),
          ...(statusFilters.length > 1 && { status: statusFilters.join(",") }),
          ...(patientNameFilter && { patient_name: patientNameFilter }),
          ...(therapistNameFilter && { therapist_name: therapistNameFilter }),
          ...(patientNumberFilter && { patient_number: patientNumberFilter }),
          ...(orderIdFilter && { order_id: orderIdFilter }),
          ...(search && { registration_number: search }),
          ...(dateFilter && { date: dateFilter }),
          ...(startDateFilter && { start_date: startDateFilter }),
          ...(endDateFilter && { end_date: endDateFilter }),
          ...(isSoapExists !== "all" && {
            is_soap_exists: isSoapExists === "true",
          }),
          ...(isEvidenceExists !== "all" && {
            is_evidence_exists: isEvidenceExists === "true",
          }),
        };

        const response = await fetchAppointments(params);
        setAppointments(response.appointments ?? []);
        setTotalPages(response.meta?.total_pages ?? 1);
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
        patientNumberFilter ||
        orderIdFilter ||
        dateFilter ||
        startDateFilter ||
        endDateFilter ||
        isSoapExists !== "all" ||
        isEvidenceExists !== "all",
      ),
    [
      search,
      statusFilters,
      patientNameFilter,
      therapistNameFilter,
      patientNumberFilter,
      orderIdFilter,
      dateFilter,
      startDateFilter,
      endDateFilter,
      isSoapExists,
      isEvidenceExists,
    ],
  );

  const handleExportAll = async () => {
    const params: FetchAppointmentsParams = {
      ...(statusFilters.length > 0 && { status: statusFilters.join(",") }),
    };
    return await fetchAllPages(fetchAppointments, params, "appointments");
  };

  return {
    appointments,
    loading,
    page,
    pageSize,
    totalPages,
    handleExportAll,
    hasActiveFilters,
    setFilters: set,
    clearFilters: clear,
  };
}
