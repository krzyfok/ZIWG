import { apiClient } from './client';
import type { User, RegisterData, loginData } from '../types';

type DoctorRegisterData = RegisterData & {
  city: string;
  email?: string;
  description?: string;
  specialization_name?: string;
};

export const authApi = {
  login: async (loginData: loginData) => {
    const { data } = await apiClient.post<User>('/login', loginData);
    return data;
  },

  register: async (registerData: RegisterData) => {
    const { data } = await apiClient.post<User>('/register', registerData);
    return data;
  },

  registerDoctor: async (registerData: DoctorRegisterData) => {
    const { data } = await apiClient.post<User>('/register/doctor', registerData);
    return data;
  }
};