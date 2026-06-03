import { apiClient } from './client';
import type { User, RegisterData, loginData } from '../types';

export const authApi = {
  login: async (loginData: loginData) => {
    const { data } = await apiClient.post<User>('/login', loginData);
    return data;
  },

  register: async (registerData: RegisterData) => {
    const { data } = await apiClient.post<User>('/register', registerData);
    return data;
  }
};