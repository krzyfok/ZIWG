import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="grid grid-cols-2 justify-center gap-4 -mt-50">
        <button 
        
          className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm text-xl font-medium transition-colors"
          onClick={() => navigate('/manage-appointments')}
        >
          <span>Edytuj grafik</span>
        </button>
        
        <button 
      

          className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm text-xl font-medium transition-colors"
          onClick={() => navigate('/edit-profile')}
        >
          Edytuj profil
        </button>
        <button 
        
          className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm text-xl font-medium transition-colors"
          onClick={() => navigate('/manage-appointments')}
        >
          <span>Wyświetl wizyty</span>
        </button>
        
        <button 
      

          className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm text-xl font-medium transition-colors"
          onClick={() => navigate('/edit-profile')}
        >
          Następna wizyta
        </button>
      </div>
    </div>
  );
};