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
  description : string
}

export interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  time: string;
  address: string;
  status: 'planned' | 'completed';
}