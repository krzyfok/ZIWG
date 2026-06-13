import { apiClient } from './client';
import type { AppointmentSlot, Doctor, Specialization } from '../types';

export const doctorApi = {
  searchDoctors: async (specialization: string, city: string): Promise<Doctor[]> => {
    const { data } = await apiClient.get<Doctor[]>('/doctors/search', {
      params: { 
        specialization, 
        city 
      },
    });
    return data;
  },
  getAllDoctors: async(): Promise<Doctor[]>=>{
    const { data } = await apiClient.get<Doctor[]>('/doctors/search', {
    });
    return data;
  },
  getDoctorById: async(id: string): Promise<Doctor>=>{
    const { data } = await apiClient.get<Doctor>(`/doctors/${id}`);
    return data;
  },
  getSpecializations: async():Promise<Specialization[]>=>{
    const {data}= await apiClient.get<Specialization[]>(`/specializations `);
    return data;
  },
  getCities: async():Promise<string[]>=>{
    const {data}= await apiClient.get<string[]>(`/cities `);
    return data;
  },
  joinWaitlist: async (doctorId: number, userId: number): Promise<void> => {
    await apiClient.post(`/doctors/${doctorId}/waitlist`, { user_id: userId });
  },
  leaveWaitlist: async (doctorId: number, userId: number): Promise<void> => {
    await apiClient.delete(`/doctors/${doctorId}/waitlist/${userId}`);
  },
  getWaitlistStatus: async (doctorId: number, userId: number): Promise<{ subscribed: boolean }> => {
    const { data } = await apiClient.get<{ subscribed: boolean }>(`/doctors/${doctorId}/waitlist/${userId}`);
    return data;
  },
};