import { apiClient } from './client';
import type { AppointmentSlot, Appointment, Notification } from '../types';

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
  },
  rateAppointment: async (appointment_id: number, rating: number): Promise<void> => {
    await apiClient.post(`/appointments/${appointment_id}/rate`, { rating });
  },
  getNotifications: async (user_id: number): Promise<Notification[]> => {
    const { data } = await apiClient.get<Notification[]>(`/users/${user_id}/notifications`);
    return data;
  },
  markNotificationRead: async (user_id: number, notification_id: number): Promise<void> => {
    await apiClient.patch(`/users/${user_id}/notifications/${notification_id}/read`);
  }
};