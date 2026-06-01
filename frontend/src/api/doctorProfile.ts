import { apiClient } from './client';
import type { Doctor, DoctorUpdate } from '../types';

export const doctorProfile = {

  getMyProfile: async (userId: number): Promise<Doctor> => {
    const { data } = await apiClient.get<Doctor>(`/doctors/me/${userId}`);
    return data;
  },

  updateMyProfile: async (userId: number, updateData: DoctorUpdate): Promise<{ message: string }> => {
    const { data } = await apiClient.put<{ message: string }>(`/doctors/me/${userId}`, updateData);
    return data;
  }
};