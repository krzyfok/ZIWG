import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../api';
import type { Appointment} from '../types';
import { useAuth } from '../context/AuthContext';

export const Appointments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planned' | 'completed'>('planned');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useAuth();
  const userId = user?.id;
  useEffect(() => {
    appointmentApi.getUserAppointments(userId).then(data => setAppointments(data));
  }, []);

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await appointmentApi.deleteAppointment(appointmentId);
      setAppointments(appointments.filter(app => app.id !== appointmentId));
    } catch (error) {
      console.error('Błąd przy anulowaniu wizyty', error);
    }
  };

  return (
    <>
      <div className="flex mb-4 border-b">
        <button 
          className={`px-6 py-2 font-medium ${activeTab === 'planned' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('planned')}
        >
          Zaplanowane wizyty
        </button>
        <button 
          className={`px-6 py-2 font-medium ${activeTab === 'completed' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('completed')}
        >
          Zakończone wizyty
        </button>
      </div>

      <div className="bg-white border rounded-md shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Data</th>
              <th className="p-3">Godzina</th>
              <th className="p-3">Adres</th>
              <th className="p-3">Specjalizacja</th>
              <th className="p-3">Lekarz</th>
              <th className="p-3">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Brak wizyt w tej kategorii.</td></tr>
            ) : (
              appointments.map(app => (
                <tr key={app.id} className="border-b">
                  <td className="p-3">{app.date}</td>
                  <td className="p-3">{app.start_time}</td>
                  <td className="p-3">{app.address}</td>
                  <td className="p-3"></td>  
                  <td className="p-3">{app.doctor}</td>
                  <td className="p-3 flex gap-2">
                    {activeTab === 'planned' ? (
                      <>
                        <button 
                          onClick={() => handleCancelAppointment(app.id)}
                          className="px-3 py-1 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50"
                        >
                          Odwołaj
                        </button>
                        <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded text-sm hover:bg-blue-50">Zmień termin</button>
                      </>
                    ) : (
                      <>
                        <button className="px-3 py-1 border border-gray-400 rounded text-sm hover:bg-gray-50">Oceń wizytę</button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Umów ponownie</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};