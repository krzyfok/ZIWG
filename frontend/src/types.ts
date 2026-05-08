export interface User {
  id: string;
  username: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  city: string;
  imageUrl?: string;
}

export interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  time: string;
  address: string;
  status: 'planned' | 'completed';
}