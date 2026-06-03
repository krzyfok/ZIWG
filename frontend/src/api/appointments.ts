import { apiClient } from './client';
import type { AppointmentSlot, Appointment } from '../types';

export const appointmentApi = {
  getAvailableSlots: async(doctor_id:string): Promise<AppointmentSlot[]>=>{
    const {data} = await apiClient.get<AppointmentSlot[]>(`/doctors/${doctor_id}/availability`);
    return data;
  },
  bookAppointment: async (user_id: number, availability_id: number): Promise<void> => {
    await apiClient.post('/appointments', { user_id, availability_id});
  },
  getUserAppointments: async (user_id: number) : Promise<Appointment[]>=>{
    const {data} = await apiClient.get<Appointment[]>(`users/${user_id}/appointments`);
    return data;
  },
  deleteAppointment: async (appointment_id: number): Promise<void> => {
    await apiClient.patch(`/appointments/${appointment_id}`);
  },
  rescheduleAppointment: async (appointment_id: number, availability_id: number): Promise<void> => {
    await apiClient.patch(`/appointments/${appointment_id}/reschedule`, { availability_id });
  }
};