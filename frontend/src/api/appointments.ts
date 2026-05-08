import { apiClient } from './client';
import type { AppointmentSlot } from '../types';

export const appointmentApi = {
  getAvailableSlots: async(id:string): Promise<AppointmentSlot[]>=>{
    const {data} = await apiClient.get<AppointmentSlot[]>(`/doctors/${id}/availability`);
    return data;
  },
  bookAppointment: async (user_id: number, availability_id: number): Promise<void> => {
    await apiClient.post('/appointments', { user_id, availability_id});
  }
};