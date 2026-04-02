export interface Therapist {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  registration_number: string;
  gender: string;
  batch: number;
  specializations: string[];
  modalities: string[];
  employment_type: string;
  employment_status: string;
  therapist_type: string;
}

export interface Address {
  address_line: string;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  notes: string | null;
}

export interface Soap {
  id: number;
  subject: string;
  objective: string;
  assessment: string;
  planning: string;
  additional_notes: string;
  initial_physical_condition?: string;
  therapy_goal_evaluation?: string;
  follow_up_therapy_plan?: string;
  next_physiotherapy_goals?: string;
  therapy_outcome_summary?: string;
  notes?: string;
  is_complete: boolean;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface EvidencePhoto {
  id: number;
  photo_type: string;
  photo_url: string;
  created_at: string;
}

export interface Evidence {
  id: number;
  latitude: number;
  longitude: number;
  photos: EvidencePhoto[];
  created_at: string;
}

export interface Visit {
  id: string;
  visit_number: number;
  status: string;
  appointment_date_time: string;
  therapist: Therapist;
  address: Address;
  is_soap_exists: boolean;
  soap_sla_minutes?: number;
  soap?: Soap;
  is_evidence_exists: boolean;
  evidence_sla_minutes?: number;
  evidence?: Evidence;
}

export interface Feedback {
  id: string;
  patient_name: string;
  therapist_name: string;
  communication_rating: number;
  service_rating: number;
  effectiveness_rating: number;
  appearance_rating: number;
  service_duration_sufficient: string;
  suggestion: string | null;
  criticism: string | null;
  issue: string | null;
  average_rating: number;
  created_at: string;
}

export interface Order {
  id: string;
  registration_number: string;
  status: string;
  payment_status: string;
  package_base_price: number;
  subtotal: number;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
  voucher_code: string | null;
  tax_percentage: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  invoice_number: string | null;
  invoice_url: string | null;
  invoice_due_date: string | null;
  user: { id: string; email: string; phone: string | null; is_admin: boolean };
  patient: { id: string; name: string; date_of_birth: string; gender: string };
  package: {
    id: number;
    name: string;
    total_visits: number;
    price_per_visit: number;
  };
  service: { id: number; name: string };
  visits: Visit[];
  payments: any[];
  has_feedback: boolean;
  feedback?: Feedback | null;
  special_notes: string | null;
  created_at: string;
  updated_at: string;
}
