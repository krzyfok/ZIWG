import type { Appointment, Doctor, User } from '../types';

const API_BASE_URL = ""; //dodac adres api

export const api = {
  
  login: async (email: string, password: string): Promise<User> => {
    // const response = await fetch(`${API_BASE_URL}/auth/login`, { ... });
    console.log("Logowanie API wywołane");
    return { id: "1", email }; // Mock
  },
  
  register: async (email: string, password: string): Promise<User> => {
    // const response = await fetch(`${API_BASE_URL}/auth/register`, { ... });
    console.log("Rejestracja API wywołana");
    return { id: "1", email }; // Mock
  },

  // --- WIZYTY ---
  getAppointments: async (): Promise<Appointment[]> => {
    // const response = await fetch(`${API_BASE_URL}/appointments`);
    return []; // Mock
  },

  cancelAppointment: async (appointmentId: string): Promise<void> => {
    // await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, { method: 'POST' });
    console.log(`Wizyta ${appointmentId} odwołana`);
  },

  rescheduleAppointment: async (appointmentId: string, newDate: string): Promise<void> => {
    // await fetch(`${API_BASE_URL}/appointments/${appointmentId}/reschedule`, { method: 'POST', body: ... });
    console.log(`Wizyta ${appointmentId} przełożona`);
  },

  // --- LEKARZE ---
  searchDoctors: async (specialization: string, city: string): Promise<Doctor[]> => {
    // const response = await fetch(`${API_BASE_URL}/doctors?spec=${specialization}&city=${city}`);
    return []; // Mock
  },

  bookAppointment: async (doctorId: string, date: string, time: string): Promise<void> => {
    // await fetch(`${API_BASE_URL}/appointments/book`, { method: 'POST', body: ... });
    console.log(`Wizyta u lekarza ${doctorId} zarezerwowana`);
  }
};