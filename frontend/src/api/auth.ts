import { apiClient } from './client';
import type { User } from '../types';

export const authApi = {
  login: async (username: string, password: string): Promise<User> => {
    const { data } = await apiClient.post<User>('/login', { username, password });
    return data;
  },

  register: async (username: string, password: string): Promise<User> => {
    const { data } = await apiClient.post<User>('/register', { username, password });
    return data;
  }
};