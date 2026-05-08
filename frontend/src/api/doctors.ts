import { apiClient } from './client';
import type { Doctor } from '../types';

export const doctorApi = {
  searchDoctors: async (specialization: string, city: string): Promise<Doctor[]> => {
    const { data } = await apiClient.get<Doctor[]>('/doctors', {
      params: { 
        spec: specialization, 
        city 
      },
    });
    return data;
  },
};