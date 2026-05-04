"use client";

import { Suspense } from "react";
import { Badge, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { format } from "date-fns";
import { useAppointmentDrafts } from "@/lib/hooks/use-appointment-drafts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function OrderDraftsPageInner() {
  const {
    drafts,
    loading,
    page,
    totalPages,
    totalItems,
    filters,
    setFilters,
    clearFilters,
  } = useAppointmentDrafts();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#6200EE]">
          Order Draft Monitoring
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Pantau dan kelola pendaftaran yang belum selesai
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ID, Pasien, atau PIC..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
      {/* Status Filter */}
        <select
          className="text-sm border border-slate-200 rounded-xl px-4 py-2 bg-white"
          value={filters.type}
          onChange={(e) => setFilters({ type: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="active">Active Drafts</option>
          <option value="expired">Expired Drafts</option>
        </select>
      {/* Status Reason Filter */}
        <select
          className="text-sm border border-slate-200 rounded-xl px-4 py-2 bg-white"
          value={filters.reason}
          onChange={(e) => setFilters({ type: e.target.value })}
        >
          <option value="">All Status Reason</option>
          <option value="null">null</option>
          <option value="null">null</option>
        </select>

        {filters.search && (
          <button onClick={clearFilters} className="text-sm text-rose-500 font-medium px-2">
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70">
                {[
                  "Draft ID",
                  "Kode Antrian",
                  "Tanggal",
                  "PIC", 
                  "Nama Pasien",
                  "Brand",
                  "Last Activity",
                  "Status",
                  "Status Reason"
                ].map((h) => (
                  <TableHead key={h} className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 py-3 px-5">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.map((draft: any, i: number) => (
                <TableRow key={draft.id} className={i % 2 === 1 ? "bg-slate-50/30" : ""}>
                  
                  {/* 1. DRAFT ID (# + id) */}
                  <TableCell className="py-3.5 px-5 font-mono text-xs font-semibold text-violet-700">
                    #{draft.id.slice(0, 8)}
                  </TableCell>

                  {/* 2. KODE ANTREAN */}
                  <TableCell className="py-3.5 px-5 text-sm">
                    {draft.form_data?.formOptions?.queueCode || "Null"}
                  </TableCell>

                  {/* 3. TANGGAL (dd-MMM-yyyy) */}
                  <TableCell className="py-3.5 px-5 text-xs">
                    {draft.created_at? format(new Date(draft.created_at), "dd-MMM-yyyy") : "-"}
                  </TableCell>

                  {/* 4. PIC (Badge Components) */}
                  <TableCell className="py-3.5 px-5">
                    <div className="flex flex-wrap gap-1">
                      {/* Contoh jika PIC admin berupa array sesuai catatan 'Multiple admins' */}
                      {draft.appointment_draft_admins?.map((admin: any) => (
                        <span key={admin.id} className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-medium">
                        <Badge>{admin.id}</Badge>
                         </span>
                      )) || "-"}
                    </div>
                  </TableCell>

                  {/* 5. NAMA PASIEN (2 Rows: Name + City) */}
                  <TableCell className="py-3.5 px-5">
                    <p className="text-sm font-medium text-slate-800">
                      {draft.form_data?.patientDetails?.fullName || "Unknown"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {draft.form_data?.patientDetails?.location?.city || "-"}
                    </p>
                  </TableCell>

                  {/* 6. BRAND (2 Rows: Service + Visit-Package) */}
                  <TableCell className="py-3.5 px-5">
                    <p className="inline-block px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-xs font-medium">
                      {draft.form_data?.appointmentScheduling?.service?.name || "-"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {draft.form_data?.appointmentScheduling?.package?.numberOfVisit || "0"} Visit — {draft.form_data?.appointmentScheduling?.package?.name || "-"}
                    </p>
                  </TableCell>

                  {/* 7. LAST ACTIVITY (2 Rows: Relative Time + Step Name) */}
                  <TableCell className="py-3.5 px-5">
                    <p className="text-[10px] text-slate-500">
                      {draft.updated_at? format(new Date(draft.updated_at), "HH:mm") : "-"}
                    </p>
                    <p className="text-[10px] font-medium text-violet-600">
                      {draft.current_step || "Start"}
                    </p>
                  </TableCell>

                  {/* 8. STATUS (Active/Expired based on expires_at) */}
                  <TableCell className="py-3.5 px-5">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                     draft.expires_at && new Date(draft.expires_at) > new Date() 
                        ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {draft.expires_at && new Date(draft.expires_at) > new Date() ? 'Active' : 'Expired'}
                    </span>
                  </TableCell>

                  {/* 9. STATUS REASON */}
                  <TableCell className="py-3.5 px-5 text-xs italic text-slate-400">
                    {draft.status_reason || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Simple */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">Total {totalItems} items</p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ page: page - 1 })}
              disabled={page <= 1 || loading}
              className="p-2 border rounded-xl disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setFilters({ page: page + 1 })}
              disabled={page >= totalPages || loading}
              className="p-2 border rounded-xl disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDraftsPage() {
  return (
    <Suspense fallback={null}>
      <OrderDraftsPageInner />
    </Suspense>
  );
}