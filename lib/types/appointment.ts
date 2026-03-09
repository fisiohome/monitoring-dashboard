// types/appointment.ts

export interface Patient {
  id: string;
  name: string;
  gender: string;
  age: number;
  date_of_birth: string;
}

export interface Therapist {
  id: string;
  full_name: string;
  gender: string;
  registration_number: string;
  therapist_type: "internal" | "external";
}

export interface AppointmentAddress {
  id: number;
  address_line: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface Appointment {
  id: string;
  registration_number: string;
  status: string;
  visit_number: number;
  appointment_date_time?: string;
  patient?: Patient;
  therapist?: Therapist;
  address: AppointmentAddress;
  service_id: number;
  service_name: string;
  package_id: number;
  package_name: string;
  location_id: number;
  is_soap_exists?: boolean;
  is_evidence_exists?: boolean;
  total_visits_in_booking?: number;
  parent_appointment_id?: string;
  created_at: string;
  updated_at: string;
}
