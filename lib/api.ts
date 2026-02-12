
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-staging.fisiohome.id";

// --- Types ---

export interface DashboardMetrics {
    funnel: {
        users: number;
        registrations: number;
        bookings_started: number;
        bookings_completed: number;
        payments_success: number;
        registration_drop_alert: boolean;
    };
    orders: {
        total_today: number;
        success: number;
        failed: number;
        stuck_count: number;
    };
    auto_assign: {
        total: number;
        success: number;
        failed: number;
    };
    reschedule: {
        total: number;
        success: number;
        failed: number;
    };
    payment: {
        success_rate: number;
        failed_count: number;
        pending_stuck_count: number;
    };
    revenue: {
        total_this_month: number;
    };
}

export interface StuckOrder {
    id: string;
    registration_number?: string;
    customer_name: string;
    customer_phone?: string;
    status: string;
    time_elapsed: string; // Formatting helper needed
    step: "Matching" | "Payment";
    created_at?: string;
}

// --- API Helper ---

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = Cookies.get("access_token");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options.headers as Record<string, string>,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        if (res.status === 401) {
            console.warn("Unauthorized access");
        }
        throw new Error(`API Request failed: ${res.statusText}`);
    }

    const json = await res.json();

    // Preserve meta if it exists alongside data
    if (json.data && json.meta && typeof json.data === 'object') {
        json.data.meta = json.meta;
    }

    return json.data || json; // Handle wrapped .data structure or direct response
}

// --- Data Fetchers ---

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
    try {
        // Parallel fetch for overview data
        // Using bookings for both orders and payments since /payments is not available
        const bookingsRes = await apiFetch<any>("/api/v1/bookings?page_size=100");
        const bookings = Array.isArray(bookingsRes) ? bookingsRes : (bookingsRes.bookings || []);

        // Logic - Calculate Orders Today
        const today = new Date().toISOString().split('T')[0];
        const todaysBookings = bookings.filter((b: any) => b.created_at?.startsWith(today));

        const successOrders = todaysBookings.filter((b: any) => b.status === "COMPLETED" || b.status === "INFO_COMPLETE").length;
        const failedOrders = todaysBookings.filter((b: any) => b.status === "CANCELLED").length;

        // Stuck Orders: > 30 mins and status is PENDING or MATCHING
        const now = new Date();
        const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);

        const stuckOrdersList = bookings.filter((b: any) => {
            const created = new Date(b.created_at);
            return (b.status === "PENDING_PAYMENT" || b.status === "MATCHING_THERAPIST") && created < thirtyMinsAgo;
        });

        // Derive Payment Metrics from Bookings
        const pendingPayments = bookings.filter((b: any) => b.status === "PENDING_PAYMENT");
        const successPayments = bookings.filter((b: any) => b.payment_status === "PAID").length;
        const totalPayments = bookings.filter((b: any) => b.payment_status).length || 1;

        // Calculate Revenue (This Month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyRevenue = bookings
            .filter((b: any) => {
                if (b.payment_status !== "PAID") return false;
                const date = new Date(b.created_at || b.date);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            })
            .reduce((sum: number, b: any) => sum + (b.total_amount || b.total_price || 0), 0);

        return {
            funnel: {
                users: 1000,
                registrations: 800,
                bookings_started: todaysBookings.length,
                bookings_completed: successOrders,
                payments_success: todaysBookings.filter((b: any) => b.payment_status === "PAID").length,
                registration_drop_alert: false,
            },
            orders: {
                total_today: todaysBookings.length,
                success: successOrders,
                failed: failedOrders,
                stuck_count: stuckOrdersList.length,
            },
            auto_assign: {
                total: 10,
                success: 8,
                failed: 2,
            },
            reschedule: {
                total: 5,
                success: 5,
                failed: 0,
            },
            payment: {
                success_rate: Math.round((successPayments / totalPayments) * 100),
                failed_count: bookings.filter((b: any) => b.payment_status === "REFUNDED" || b.payment_status === "FAILED").length,
                pending_stuck_count: pendingPayments.length,
            },
            revenue: {
                total_this_month: monthlyRevenue,
            },
        };
    } catch (error) {
        console.error("Failed to fetch dashboard metrics", error);
        return {
            funnel: { users: 0, registrations: 0, bookings_started: 0, bookings_completed: 0, payments_success: 0, registration_drop_alert: false },
            orders: { total_today: 0, success: 0, failed: 0, stuck_count: 0 },
            auto_assign: { total: 0, success: 0, failed: 0 },
            reschedule: { total: 0, success: 0, failed: 0 },
            payment: { success_rate: 0, failed_count: 0, pending_stuck_count: 0 },
            revenue: { total_this_month: 0 },
        };
    }
}

export async function fetchStuckOrders(): Promise<StuckOrder[]> {
    try {
        const res: any = await apiFetch("/api/v1/bookings?status=PENDING_PAYMENT&page_size=50");
        const bookings = Array.isArray(res) ? res : (res.bookings || []);

        const now = new Date();
        const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);

        return bookings
            .filter((b: any) => {
                const created = new Date(b.created_at);
                return created < thirtyMinsAgo;
            })
            .map((b: any) => ({
                id: b.id,
                registration_number: b.registration_number,
                customer_name: b.patient?.name || b.customer?.full_name || b.customer?.name || b.user?.name || b.user?.email || "Unknown Customer",
                customer_phone: b.patient?.phone_number || b.patient?.phone || b.customer?.phone_number || b.customer?.phone || b.user?.phone_number,
                status: b.status,
                time_elapsed: "30+ mins",
                step: b.status === "PENDING_PAYMENT" ? "Payment" : "Matching",
                created_at: b.created_at
            }))
            .slice(0, 5);
    } catch (e) {
        return [];
    }
}

// Generic Fetcher for Orders Page
export async function fetchOrders(params?: any) {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch<any>(`/api/v1/bookings?${queryString}`);
}

// Generic Fetcher for Payments Page (Using Bookings as proxy)
export async function fetchPayments(params?: any) {
    const queryString = new URLSearchParams(params).toString();
    // Fetch bookings to display as payments, filtering logic can be advanced later
    return apiFetch<any>(`/api/v1/bookings?${queryString}`);
}

// Appointments API
export async function fetchAppointments(params?: any) {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch<any>(`/api/v1/appointments?${queryString}`);
}

export async function fetchAppointmentById(id: string) {
    return apiFetch<any>(`/api/v1/appointments/${id}`);
}

export async function fetchOrderById(id: string) {
    return apiFetch<any>(`/api/v1/bookings/${id}`);
}

