
import { useState, useEffect } from "react";
interface AppointmentDraft {
  id: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  current_step: string;
  status_reason: string;
  form_data: {
    formOptions: {
      queueCode: string;
    };
    patientDetails: {
      fullName: string;
      location: {
        city: string;
      };
    };
    appointmentScheduling: {
      service: { name: string };
      package: {
        numberOfVisit: number;
        name: string;
      };
    };
  };
  appointment_draft_admins: Array<{
    id: string;
    name: string;
  }>;
}


export const MOCK_DRAFTS: Partial<AppointmentDraft>[]= [
  {
    id: "VL96103",
    created_at: "2026-01-01T08:43:40Z",
    updated_at: "2026-03-21T10:30:00Z",
    expires_at: "2026-12-31T23:59:59Z", // Masih lama (Active)
    current_step: "Menunggu Jadwal",
    status_reason: "Paid",
    
    // Struktur nested sesuai image_4dfc54.png
    form_data: {
      formOptions: {
        queueCode: "KA68119"
      },
      patientDetails: {
        fullName: "Bonggur Pasaribu",
        location: {
          city: "Bogor Kabupaten"
        }
      },
      appointmentScheduling: {
        service: { name: "FISIOHOME_SPECIAL_TIER" },
        package: {
          numberOfVisit: 4,
          name: "Oder Visit"
        }
      }
    },
    
    // Data admin sesuai catatan 'Multiple admins'
    appointment_draft_admins: [
      { id: "adm1", name: "Bonggur Pasaribu" },
      { id: "adm2", name: "Feninda" }
    ]
  },
  {
    id: "draft_002_abc",
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-11T15:00:00Z",
    expires_at: "2024-02-01T00:00:00Z", // Sudah lewat (Expired)
    current_step: "Payment",
    status_reason: "Payment link expired",
    form_data: {
      formOptions: { queueCode: "B-042" },
      patientDetails: {
        fullName: "Siti Aminah",
        location: { city: "Bandung" }
      },
      appointmentScheduling: {
        service: { name: "Dental Care" },
        package: {
          numberOfVisit: 3,
          name: "Family Ortho"
        }
      }
    },
    appointment_draft_admins: [
      { id: "adm3", name: "Admin Riza" }
    ]
  }
];

export function useAppointmentDrafts() {
  const [drafts, setDrafts] = useState<any[]>(MOCK_DRAFTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    reason: "",
    type: "",
    page: 1 ,
    limit: 10
  });
 
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: MOCK_DRAFTS.length
  });

/*
useEffect(() => {
    const fetchData = async () => {
      
      setLoading(true);
      setError(null);

      try {
        // 1. Menyusun Query Parameters
        const query = new URLSearchParams({
          q: filters.search,
          status: filters.type,
          reason: filters.reason,
          page: filters.page.toString(),
          limit: filters.limit.toString()
        }).toString();

        // 2. Memanggil API dengan fetch
        const response = await fetch(`/api/v1/dashboard/appointment_drafts?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();

        // 4. Update State (Sesuaikan dengan struktur JSON dari backend)
        setDrafts(result.data); 
        setPagination({
          totalPages: result.meta.total_pages,
          totalItems: result.meta.total_items
        });

      } catch (err: any) {
        setError(err.message || "Error saat pengambilan data");
      } finally {
        setLoading(false);
      }    
      };

    fetchData();
  }, [filters]);
*/
    //Filter Manual.
    useEffect(() => {
      setLoading(true);
      const timer = setTimeout(() => {
        const filtered = MOCK_DRAFTS.filter(item => {
          const searchTerm = filters.search.toLowerCase();
          
          // Mencari di ID dan Nama Pasien
          const matchesSearch = 
            item.id?.toLowerCase().includes(searchTerm) ||
            item.form_data?.patientDetails?.fullName?.toLowerCase().includes(searchTerm) ||
            item.form_data?.formOptions?.queueCode?.toLowerCase().includes(searchTerm);

          // Filter Status (jika ada)
          const matchesType = filters.type === "" || 
            (filters.type === "active" ? new Date(item.expires_at!) > new Date() : new Date(item.expires_at!) <= new Date());

          return matchesSearch && matchesType;
        });

        setDrafts(filtered);
        setLoading(false);
      }, 300); // Debounce agar tidak berat

      return () => clearTimeout(timer);
    }, [filters]); 

  return {
    drafts,
    loading,
    page: filters.page,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    filters,
    setFilters: (newFilters: any) => setFilters(prev => ({ ...prev, ...newFilters })),
    clearFilters: () => setFilters({ search: "", reason: "", type: "active", page: 1 , limit : 10})
  };
}