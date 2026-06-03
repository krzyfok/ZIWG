export interface User {
  id: string;
  username: string;
}

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specializations: string[];
  city: string;
  imageUrl?: string;
  description : string;
  email: string;
  phone: string;
  address: string;
}

export interface Specialization {
  id: string;
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
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
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