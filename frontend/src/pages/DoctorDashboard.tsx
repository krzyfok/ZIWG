import React from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api';
import { useAuth } from '../context/AuthContext';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const handleNextAppointment = async () => {
    if (!userId) {
      navigate('/doctor-dashboard/appointments');
      return;
    }
    try {
      const apps = await adminApi.getMyAppointments(userId);
      const scheduled = apps.filter(a => a.status === 'scheduled');
      const now = new Date();
      const upcoming = scheduled
        .map(a => ({ ...a, datetime: new Date(`${a.date}T${a.start_time}`) }))
        .filter(a => a.datetime >= now)
        .sort((x, y) => (x.datetime as any) - (y.datetime as any));
      if (upcoming.length > 0) {
        navigate(`/doctor-dashboard/appointments/${upcoming[0].id}/summary`);
      } else {
        navigate('/doctor-dashboard/appointments');
      }
    } catch (err) {
      console.error('Failed to fetch appointments', err);
      navigate('/doctor-dashboard/appointments');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="grid grid-cols-2 justify-center gap-4 -mt-50">
        <button 
        
          className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm text-xl font-medium transition-colors"
          onClick={() => navigate('/doctor-dashboard/availability')}
        >
          <span>Edytuj grafik</span>
        </button>
        
        <button 
      

          className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm text-xl font-medium transition-colors"
          onClick={() => navigate('/doctor-dashboard/edit-profile')}
        >
          Edytuj profil
        </button>
        <button 
        
          className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm text-xl font-medium transition-colors"
          onClick={() => navigate('/doctor-dashboard/appointments')}
        >
          <span>Wyświetl wizyty</span>
        </button>
        <button 
          className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm text-xl font-medium transition-colors"
          onClick={handleNextAppointment}
        >
          Następna wizyta
        </button>
      </div>
    </div>
  );
};