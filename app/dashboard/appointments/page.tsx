"use client";

import { fetchAllPages } from "@/lib/export-utils";
import { ExportExcelButton } from "@/components/ui/ExportExcelButton";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar as CalendarIcon, MoreHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";
import { fetchAppointments } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    // Filter State
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    useEffect(() => {
        async function loadAppointments() {
            setLoading(true);
            try {
                // Build params
                const params: any = {
                    page: page,
                    page_size: pageSize,
                };

                if (statusFilter !== "ALL") {
                    params.status = statusFilter;
                }

                const response = await fetchAppointments(params);

                // Handle various response shapes
                const list = response.data?.appointments || response.appointments || (Array.isArray(response) ? response : []);
                setAppointments(list);

                // Handle Pagination Meta
                const meta = response.meta || response.data?.meta;
                if (meta) {
                    setTotalPages(meta.total_pages);
                } else {
                    // Fallback if no meta
                    setTotalPages(list.length < pageSize ? page : page + 1);
                }

            } catch (error) {
                console.error("Failed to load appointments", error);
            } finally {
                setLoading(false);
            }
        }
        loadAppointments();
    }, [page, statusFilter]);

    // Client-side search (as backup or refinement) behavior
    const filteredAppointments = appointments.filter((apt) =>
        apt.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
        apt.therapist?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        apt.registration_number?.toLowerCase().includes(search.toLowerCase()) ||
        apt.id?.toLowerCase().includes(search.toLowerCase())
    );

    const handleNextPage = () => {
        if (page < totalPages) setPage(p => p + 1);
    }

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1);
    }

    const clearFilters = () => {
        setStatusFilter("ALL");
        setPage(1);
    }

    const handleExportAll = async () => {
        const params: any = {};
        if (statusFilter !== "ALL") {
            params.status = statusFilter;
        }
        return await fetchAllPages(fetchAppointments, params, "appointments");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#6200EE]">Appointments</h1>
                    <p className="text-muted-foreground mt-1">Manage and track all therapist appointments</p>
                </div>
            </div>

            {/* Filter Card */}
            <Card className="border-none shadow-sm rounded-3xl bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by patient, therapist, or Reg No..."
                                className="pl-10 bg-white border-slate-200 focus-visible:ring-[#6200EE]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={`gap-2 w-full md:w-auto ${statusFilter !== 'ALL' ? 'border-[#6200EE] text-[#6200EE] bg-purple-50' : 'bg-white border-slate-200'}`}>
                                        <Filter className="h-4 w-4" />
                                        {statusFilter !== 'ALL' ? statusFilter : 'Filter Status'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-60 p-4" align="end">
                                    <div className="space-y-4">
                                        <h4 className="font-medium leading-none">Filter Appointments</h4>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                                    <SelectItem value="UNSCHEDULED">Unscheduled</SelectItem>
                                                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {statusFilter !== 'ALL' && (
                                            <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <X className="mr-2 h-4 w-4" /> Clear Filters
                                            </Button>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Card */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-purple-100 px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <CardTitle className="text-lg font-bold text-[#6200EE]">Appointments List</CardTitle>
                    <ExportExcelButton data={filteredAppointments} fileName="Appointments" onFetchAll={handleExportAll} />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow className="border-b border-slate-200 hover:bg-transparent">
                                    <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4 px-6">Registration No.</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">Patient</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">Therapist</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">Service</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">Date & Time</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4 text-center">Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredAppointments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <p>No appointments found.</p>
                                                {statusFilter !== 'ALL' && (
                                                    <Button variant="link" onClick={clearFilters}>Clear filters</Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAppointments.map((apt, index) => (
                                        <TableRow
                                            key={apt.id}
                                            className={`group transition-all duration-200 border-b border-slate-100 hover:bg-purple-50/30 hover:shadow-sm ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                                        >
                                            <TableCell className="font-mono text-xs font-semibold text-[#6200EE] py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#6200EE] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {apt.registration_number || apt.id.slice(0, 8)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900">{apt.patient?.name || "Unknown"}</span>
                                                    <span className="text-xs text-slate-500">{apt.patient?.phone_number || apt.patient?.gender}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {apt.therapist ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900">{apt.therapist.full_name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-400 italic">Unassigned</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-normal">
                                                    {apt.service_name?.replace(/_/g, " ") || apt.service?.name || "Therapy Session"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                                                    {apt.appointment_date ? format(new Date(apt.appointment_date), "MMM d, yyyy • HH:mm") : (
                                                        <span className="text-slate-400 text-xs italic">Not scheduled</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-center">
                                                <StatusBadge status={apt.status} />
                                            </TableCell>
                                            <TableCell className="py-4 text-right">
                                                <Link href={`/dashboard/appointments/${apt.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-[#6200EE] hover:bg-purple-50">
                                                        View
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between px-6 py-5 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                        <div className="text-sm font-medium text-slate-600">
                            Page <span className="font-bold text-[#6200EE]">{page}</span> of <span className="font-bold">{Math.ceil(totalPages) || 1}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevPage}
                                disabled={page <= 1 || loading}
                                className="rounded-xl border-slate-300 hover:bg-[#6200EE] hover:text-white hover:border-[#6200EE] transition-all"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={page >= totalPages || loading}
                                className="rounded-xl border-slate-300 hover:bg-[#6200EE] hover:text-white hover:border-[#6200EE] transition-all"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
        COMPLETED: "bg-green-50 text-green-700 border-green-200",
        CANCELLED: "bg-red-50 text-red-700 border-red-200",
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        UNSCHEDULED: "bg-slate-50 text-slate-700 border-slate-200",
    };

    return (
        <Badge variant="outline" className={`font-semibold border-2 px-3 py-1 rounded-full text-xs ${styles[status] || "bg-slate-50 text-slate-700"}`}>
            {status?.replace(/_/g, " ") || "UNKNOWN"}
        </Badge>
    );
}
