import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentApi } from '../api';
import type { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import {type AppointmentStatus } from '../types';
export const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AppointmentStatus>('scheduled');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useAuth();
  const userId = user?.id;
 
  const fetchAppointments = () => {
    if (userId) {
      appointmentApi.getUserAppointments(userId).then(data => setAppointments(data));
    }
  };
   useEffect(() => {
   fetchAppointments();
  }, [userId]);


  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await appointmentApi.deleteAppointment(appointmentId);
      setAppointments(appointments.filter(app => app.id !== appointmentId));
    } catch (error) {
      console.error('Błąd przy anulowaniu wizyty', error);
    }
    fetchAppointments();
  };

  const filteredAppointments = appointments.filter(app => {
    if (activeTab === 'scheduled') return app.status === 'scheduled';
    if (activeTab === 'completed') return app.status === 'completed'
    if (activeTab === 'cancelled') return app.status === 'cancelled'; 
    if (activeTab === 'no_show') return app.status === 'no_show';
    return true; 
  });

  return (
    <>
      <div className="flex mb-4 border-b">
        <button 
          className={`px-6 py-2 font-medium ${activeTab === 'scheduled' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('scheduled')}
        >
          Zaplanowane wizyty
        </button>
        <button 
          className={`px-6 py-2 font-medium ${activeTab === 'completed' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('completed')}
        >
          Zakończone wizyty
        </button>
        <button 
          className={`px-6 py-2 font-medium ${activeTab === 'cancelled' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Anulowane wizyty
        </button>
        <button 
          className={`px-6 py-2 font-medium ${activeTab === 'no_show' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('no_show')}
        >
          Niezrealizowane wizyty
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
            {filteredAppointments.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Brak wizyt w tej kategorii.</td></tr>
            ) : (
              filteredAppointments.map(app => (
                <tr key={app.id} className="border-b">
                  <td className="p-3">{app.date}</td>
                  <td className="p-3">{app.start_time}</td>
                  <td className="p-3">{app.address}</td>
                  <td className="p-3">{app.specializations}</td>  
                  <td className="p-3">{app.doctor}</td>
                  <td className="p-3 flex gap-2">
                    {activeTab === 'scheduled' ? (
                      <>
                        <button 
                          onClick={() => handleCancelAppointment(app.id)}
                          className="px-3 py-1 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50"
                        >
                          Odwołaj
                        </button>
                        <button 
                          onClick={() => navigate(`/doctor/${app.doctor_id}/appointments?appointmentId=${app.id}`)}
                          className="px-3 py-1 border border-blue-500 text-blue-500 rounded text-sm hover:bg-blue-50"
                        >
                          Zmień termin
                        </button>
                      </>
                    ) : activeTab === 'completed' ? (
                      <>
                        <button className="px-3 py-1 border border-gray-400 rounded text-sm hover:bg-gray-50">Oceń wizytę</button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Umów ponownie</button>
                      </>
                    ): (
                      <button className="px-3 py-1 border border-gray-400 rounded text-sm hover:bg-gray-50">Brak dostępnych działań</button>
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