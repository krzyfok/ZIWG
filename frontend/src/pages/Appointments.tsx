import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentApi } from '../api';
import type { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import {type AppointmentStatus } from '../types';
import { StarRating } from '../components/StartRating';
export const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AppointmentStatus>('scheduled');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useAuth();
  const userId = user?.id;
  const [ratingMode, setRatingMode] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
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

  const handleRateAppointment = async (appointmentId: number) => {
    if (currentRating === 0) return;

    try {
      await appointmentApi.rateAppointment(appointmentId, currentRating);
      fetchAppointments(); 
 
      setRatingMode(null);
      setCurrentRating(0);
    } catch (error) {
      console.error('Błąd przy zapisywaniu oceny', error);
    }
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
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            
            {/* Nagłówek okienka */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Zalecenia z wizyty
              </h3>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
                {selectedAppointment.medical_notes 
                  ? selectedAppointment.medical_notes 
                  : <span className="text-gray-500 italic">Lekarz nie dodał jeszcze żadnych zaleceń do tej wizyty.</span>
                }
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="px-6 py-2 bg-gray-600 text-white font-medium rounded hover:bg-gray-700 transition-colors"
              >
                Zamknij
              </button>
            </div>
            
          </div>
        </div>
      )}
      <div className="bg-white border rounded-md shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Data</th>
              <th className="p-3">Godzina</th>
              <th className="p-3">Adres</th>
              <th className="p-3">Specjalizacja</th>
              <th className="p-3">Lekarz</th>
              <th className="p-3 text-center">Akcje</th>
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
                        {ratingMode === app.id ? (
                          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded border">
                            <StarRating 
                               value={currentRating} 
                               onChange={setCurrentRating} 
                            />
                            <button 
                              onClick={() => handleRateAppointment(app.id)}
                              className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                            >
                              Zapisz
                            </button>
                            <button 
                              onClick={() => setRatingMode(null)}
                              className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded text-xs"
                            >
                              Anuluj
                            </button>
                          </div>
                        ) : (
                          <>
                            {app.rating ? (
                              <div className="mr-2">
                                <StarRating value={app.rating} onChange={() => {}} readOnly />
                              </div>
                            ) : (
                              <button 
                                onClick={() => {
                                  setRatingMode(app.id);
                                  setCurrentRating(0);
                                }}
                                className="px-3 py-1 border border-yellow-500 text-yellow-600 rounded text-sm hover:bg-yellow-50"
                              >
                                Oceń wizytę
                              </button>
                            )}
                            
                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            onClick={() => setSelectedAppointment(app)}
                            >
                              Wyśwetl notatki
                            </button>
                            
                          </>
                        )}
                      </>
                    ) : (
                      <button className="px-3 py-1 border border-gray-400 rounded text-sm hover:bg-gray-50">
                        Brak dostępnych działań
                      </button>
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