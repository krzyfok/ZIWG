import { apiClient } from './client';
import type { Doctor, Specialization } from '../types';

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
    const {data}= await apiClient.get<Specialization[]>(`/specializations `)
    return data;
  }
};