/**
 * Appointment draft detail as returned by
 * GET /api/v1/dashboard/appointment_drafts/:id
 */
export interface AppointmentDraft {
  /* ---------- Informasi Utama ---------- */
  id: string;                 // Draft ID (primary key)
  requestCode: string;        // Human-readable code shown in UI list
  status: DraftStatus;        // Workflow status
  statusReason: string | null;
  lastStep: string;
  updatedAt: string;          // ISO-8601 timestamp

  /* ---------- Informasi Pasien & Klien ---------- */
  patient: PersonContact;     // Pasien (jika pasien = klien, cukup isi satu)
  client?: PersonContact;     // Opsional, jika ada entitas “pemesan” terpisah

  /* ---------- Informasi Lokasi ---------- */
  location: AddressBlock;

  /* ---------- Informasi Layanan & Jadwal ---------- */
  service: {
    name: string;             // Nama layanan / paket
    schedule: string;         // ISO-8601 datetime (jadwal kunjungan)
    note?: string;            // Catatan tambahan (optional)
  };

  /* ---------- Informasi PIC (Admin) ---------- */
  pic: PersonContact;
}

/* ===== Supporting Types ===== */

export type DraftStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface PersonContact {
  name: string;
  phone: string;
  email?: string;
  gender?: string;
  age?: number;         
  dateOfBirth?: string;  
  medicalRecord: {
    condition: string;
    history: string;
    onsetDate: string;
    complaint: string;
  };
}

export interface AddressBlock {
  address: string;
  city: string;
  province: string;
  postalCode: string;
}