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
  phone: number;
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
}