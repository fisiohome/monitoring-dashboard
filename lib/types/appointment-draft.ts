export type DraftStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED"
  | "EXPIRED";

export interface PersonContact {
  name: string;
  phone: string;
  email?: string;
  gender?: string;
  age?: number;
  dateOfBirth?: string;
}

export interface AddressBlock {
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface AppointmentDraft {
  id: string;
  requestCode: string;
  status: DraftStatus;
  statusReason: string | null;
  lastStep: string;
  createdAt: string;
  updatedAt: string;
  expiredAt?: string;
  patient: PersonContact;
  client?: PersonContact;
  location: AddressBlock;
  service: {
    name: string;
    schedule: string;
    note?: string;
    package?: {
      name: string;
      numberOfVisit: number;
    };
  };
  medicalRecord: {
    condition: string;
    history: string;
    onsetDate: string;
    complaint: string;
  };
  additionalSettings: {
    voucherCode?: string;
    referralSource?: string;
    customReferralSource?: string;
    partnerName?: string;
    isPartnerBooking?: boolean;
  };
  pic: PersonContact;
}