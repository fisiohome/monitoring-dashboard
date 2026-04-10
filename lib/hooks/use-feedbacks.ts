"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchFeedbacks, FetchFeedbacksParams, Feedback } from "@/lib/api/feedbacks";
import { useFilterParams } from "@/lib/hooks/use-filter-params";
import { formatDateFilter } from "@/lib/utils";

export function useFeedbacks() {
  const { get, getAll, set, clear, searchParams } = useFilterParams();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const page = parseInt(get("page", "1")) || 1;
  const limit = parseInt(get("limit", "10")) || 10;
  const registrationNumber = get("registration_number");
  const therapistName = get("therapist_name");
  const patientName = get("patient_name");
  const startDate = get("start_date");
  const endDate = get("end_date");
  const score = get("score");
  const hasComment = get("has_comment");

  useEffect(() => {
    async function loadFeedbacks() {
      setLoading(true);
      try {
        const params: FetchFeedbacksParams = {
          page,
          limit,
          ...(registrationNumber && { registration_number: registrationNumber }),
          ...(therapistName && { therapist_name: therapistName }),
          ...(patientName && { patient_name: patientName }),
          ...(startDate && { start_date: formatDateFilter(startDate) }),
          ...(endDate && { end_date: formatDateFilter(endDate, true) }),
          ...(score && { score }),
          ...(hasComment && { has_comment: hasComment }),
        };

        const response = await fetchFeedbacks(params);
        
        // Handle both direct array or wrapped response if needed
        // Assuming fetchFeedbacks handles the .data unpacking but metadata might be needed
        // Based on apiFetch: return json.data || json;
        // And apiFetch preserves meta if it exists alongside data: json.data.meta = json.meta;
        
        const data = response as any;
        setFeedbacks(Array.isArray(data) ? data : (data.data || []));
        setTotalPages(data.meta?.total_pages ?? 1);
        setTotalItems(data.meta?.total_items ?? 0);
      } catch (error: any) {
        console.error("Failed to load feedbacks", error);
        toast.error("Gagal memuat data feedback", {
          description: error?.message || "Terjadi kesalahan sistem.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadFeedbacks();
  }, [searchParams.toString()]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        registrationNumber ||
        therapistName ||
        patientName ||
        startDate ||
        endDate ||
        score ||
        hasComment
      ),
    [registrationNumber, therapistName, patientName, startDate, endDate, score, hasComment]
  );

  return {
    feedbacks,
    loading,
    page,
    limit,
    totalPages,
    totalItems,
    hasActiveFilters,
    setFilters: set,
    clearFilters: clear,
  };
}
