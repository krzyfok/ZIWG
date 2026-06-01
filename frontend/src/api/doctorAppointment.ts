import { apiClient } from './client';
import type {Doctor, DoctorUpdate, Availability, AvailabilityCreate } from '../types';

export const adminApi = {

  getMyProfile: async (userId: number): Promise<Doctor> => {
    const { data } = await apiClient.get<Doctor>(`/doctors/me/${userId}`);
    return data;
  },


  updateMyProfile: async (userId: number, updateData: DoctorUpdate): Promise<{ message: string }> => {
    const { data } = await apiClient.put<{ message: string }>(`/doctors/me/${userId}`, updateData);
    return data;
  },


  getMyAvailability: async (userId: number): Promise<Availability[]> => {
    const { data } = await apiClient.get<Availability[]>(`/doctors/me/${userId}/availability`);
    return data;
  },

  createAvailability: async (userId: number, availabilityData: AvailabilityCreate): Promise<{ message: string, id: number }> => {
    const { data } = await apiClient.post<{ message: string, id: number }>(`/doctors/me/${userId}/availability`, availabilityData);
    return data;
  },

  deleteAvailability: async (availabilityId: number): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(`/availability/${availabilityId}`);
    return data;
  }
};