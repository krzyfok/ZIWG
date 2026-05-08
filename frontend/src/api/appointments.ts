import { apiClient } from './client';
import type { Appointment } from '../types';

export const appointmentApi = {
  getAppointments: async (): Promise<Appointment[]> => {
    const { data } = await apiClient.get<Appointment[]>('/appointments');
    return data;
  },

  cancelAppointment: async (id: string): Promise<void> => {
    await apiClient.post(`/appointments/${id}/cancel`);
  },

  bookAppointment: async (doctorId: string, date: string, time: string): Promise<void> => {
    await apiClient.post('/appointments/book', { doctorId, date, time });
  }
};