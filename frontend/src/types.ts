export interface User {
  id: number;
  username: string;
  name: string;
  surname: string;
  phone_number: string;
  address: string;
  role: 'patient' | 'doctor'; 
}

export interface RegisterData {
  username: string;
  password: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
}
export interface loginData {
  username: string;
  password: string;
}

export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  specializations: string[];
  city: string;
  imageUrl?: string;
  description : string;
  email: string;
  phone: string;
  address: string;
  average_rating?: number;
  reviews_count?: number;
}

export interface Specialization {
  id: number;
  name: string;
  
}

export interface AppointmentSlot {
  id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  doctor_id: number;
  date: string;
  address?:string;
}

export interface Appointment {
  id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  doctor_id: number;
  doctor: string;
  date: string;
  address?:string;
  status: AppointmentStatus;
  specializations: string[];
  rating?: number;
  medical_notes?: string;
}

export type AppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'no_show';
export interface DoctorAppointmentDetails {
  id: number;
  start_time: string;
  end_time: string;
  date: string;
  patient_address:string;
  status: AppointmentStatus;
  patient_name: string;
  patient_phone: number;
  medical_notes: string;
}

export interface DoctorUpdate {
  first_name: string;
  last_name: string;
  city: string;
  address: string;
  description?: string;
  phone?: string;
  email?: string;
}

export interface Availability {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface AvailabilityCreate {
  date: string;
  start_time: string;
  end_time: string;
}