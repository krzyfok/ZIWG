import { apiClient } from './client';
import type { Doctor } from '../types';

export const doctorApi = {
  searchDoctors: async (specialization: string, city: string): Promise<Doctor[]> => {
    const { data } = await apiClient.get<Doctor[]>('/doctors/search', {
      params: { 
        spec: specialization, 
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
  }
};