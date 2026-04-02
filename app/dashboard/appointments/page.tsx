"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useAppointments } from "@/lib/hooks/use-appointments";
import { CopyButton } from "@/components/ui/copy-button";
import { AppointmentFilterBar } from "@/components/sections/appointmets/appointment-filter-bar";
import { StatusBadge } from "@/components/sections/appointmets/status-badge";
import { ExportExcelButton } from "@/components/ui/ExportExcelButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment } from "@/lib/types/appointment";
import { format } from "date-fns";

function AppointmentsPageInner() {
  const {
    appointments,
    loading,
    page,
    limit,
    totalPages,
    totalItems,
    handleExportAll,
    hasActiveFilters,
    setFilters,
    clearFilters,
  } = useAppointments();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#6200EE]">
          Appointments
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage and track all therapist appointments
        </p>
      </div>

      <AppointmentFilterBar />

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">
            Appointments List
          </h2>
          <ExportExcelButton
            data={appointments.map((apt: any) => ({
              ...apt,
              "SOAP Link": `${process.env.NEXT_PUBLIC_SOAP_BASE_URL || "https://karpis.fisiohome.id"}/bookings/${apt.id}/soap`,
            }))}
            fileName="Appointments"
            onFetchAll={async (onProgress) => {
              const all = await handleExportAll(onProgress);
              return all.map((apt: any) => ({
                ...apt,
                "SOAP Link": `${process.env.NEXT_PUBLIC_SOAP_BASE_URL || "https://karpis.fisiohome.id"}/bookings/${apt.id}/soap`,
              }));
            }}
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                {[
                  "Registration No.",
                  "Visit",
                  "Appointment Date",
                  "Patient",
                  "Therapist",
                  "Service",
                  "Package",
                  "Location",
                  "Status",
                  "",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 py-3 px-5 bg-slate-50/70"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-slate-50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j} className="py-3.5 px-5">
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : appointments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-40 text-center text-sm text-slate-400"
                  >
                    No appointments found.{" "}
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="underline text-violet-600 hover:text-violet-700"
                      >
                        Clear filters
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((apt: Appointment, i: number) => (
                  <TableRow
                    key={apt.id}
                    className={`group border-b border-slate-50 hover:bg-violet-50/40 transition-colors ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}
                  >
                    <TableCell className="py-3.5 px-5 font-mono text-xs font-semibold text-violet-700">
                      <div className="flex items-center justify-between group/copy">
                        <span>
                          {apt.registration_number || apt.id?.slice(0, 8)}
                        </span>
                        <CopyButton
                          value={apt.registration_number || apt.id}
                          className="opacity-0 group-hover/copy:opacity-100 transition-opacity"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <p className="text-sm font-medium text-slate-800">
                        Visit {apt.visit_number}
                      </p>
                      <p className="text-xs text-slate-400">
                        of {apt.total_visits_in_booking}
                      </p>
                    </TableCell>
                    <TableCell className="py-3.5 px-5 font-mono text-xs font-semibold text-violet-700">
                      {apt.appointment_date_time ? (
                        <>
                          <p>
                            {format(new Date(apt.appointment_date_time), "PP")}
                          </p>
                          <p>
                            {format(new Date(apt.appointment_date_time), "p")}
                          </p>
                        </>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <p className="text-sm font-medium text-slate-800 leading-tight">
                        {apt.patient?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {[
                          apt.patient?.gender,
                          apt.patient?.age && `${apt.patient.age} yo`,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      {apt.therapist ? (
                        <>
                          <p className="text-sm font-medium text-slate-800 leading-tight">
                            {apt.therapist.full_name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {apt.therapist.registration_number}
                          </p>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 capitalize">
                            {apt.therapist.therapist_type}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-xs font-medium">
                        {apt.service_name?.replace(/_/g, " ") || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 px-5 text-sm text-slate-600">
                      {apt.package_name || "—"}
                    </TableCell>

                    <TableCell className="py-3.5 px-5 text-xs text-slate-500">
                      <p>{apt.address?.city || "—"}</p>
                      <p className="text-slate-400">{apt.address?.state}</p>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <StatusBadge status={apt.status} />
                    </TableCell>
                    <TableCell className="py-3.5 px-5 text-right">
                      <Link href={`/dashboard/appointments/${apt.id}`}>
                        <button className="text-xs text-slate-400 hover:text-violet-600 font-medium transition-colors opacity-0 group-hover:opacity-100">
                          View →
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs text-slate-400">
              Page <span className="font-semibold text-slate-700">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">{totalPages}</span>{" "}
              • Total{" "}
              <span className="font-semibold text-slate-700">{totalItems}</span>{" "}
              items
            </p>
            <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Show
              </span>
              <select
                value={limit}
                onChange={(e) =>
                  setFilters({ limit: e.target.value, page: "1" })
                }
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-400 transition text-slate-700 cursor-pointer"
              >
                {[10, 50, 100].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilters({ page: String(page - 1) })}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <button
              onClick={() => setFilters({ page: String(page + 1) })}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense>
      <AppointmentsPageInner />
    </Suspense>
  );
}
