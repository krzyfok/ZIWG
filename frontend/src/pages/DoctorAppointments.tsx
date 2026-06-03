import React, { useState, useEffect } from 'react';
import { adminApi } from '../api';
import type { DoctorAppointmentDetails } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DoctorAppointments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planned' | 'completed' | 'cancelled'>('planned');
  const [appointments, setAppointments] = useState<DoctorAppointmentDetails[]>([]);
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();
  const fetchAppointments = () => {
    if (userId) {
      adminApi.getMyAppointments(userId).then(data => setAppointments(data));
    }
  };
   useEffect(() => {
   fetchAppointments();
  }, [userId]);



  const filteredAppointments = appointments.filter(app => {
    if (activeTab === 'planned') return app.status === 'scheduled';
    if (activeTab === 'completed') return app.status === 'completed' || app.status === 'no_show';
    if (activeTab === 'cancelled') return app.status === 'cancelled'; 
    return true; 
  });

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
        <button 
          className={`px-6 py-2 font-medium ${activeTab === 'cancelled' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Anulowane wizyty
        </button>
      </div>

      <div className="bg-white border rounded-md shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Data</th>
              <th className="p-3">Godzina</th>
              <th className="p-3">Imię i nazwisko</th>
              <th className="p-3">Numer telefonu</th>
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
                  <td className="p-3">{app.patient_name}</td>
                  <td className="p-3">{app.patient_phone}</td>
                  <td className="p-3 flex gap-2">
                    {activeTab === 'planned' ? (
                      <>
                        <button 
                        
                          className="px-3 py-1 border border-blue-500 text-blue-500 rounded text-sm hover:bg-blue-50"
                          onClick={() => navigate(`/doctor-dashboard/appointments/${app.id}/summary`)}
                        >
                          Podsumuj wizytę

                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                            className="px-3 py-1 border border-gray-400 rounded text-sm hover:bg-gray-50"
                            onClick={() => navigate(`/doctor-dashboard/appointments/${app.id}/summary`)}
                        >
                           Szczegóły
                        </button>
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