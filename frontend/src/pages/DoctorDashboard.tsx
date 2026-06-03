import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-6 mt-10 justify-center">
      <button 
       
        className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm flex flex-col items-center justify-center text-xl font-medium transition-colors"
        onClick={() => navigate('/manage-appointments')}
      >
        <span>Edytuj grafik</span>
      </button>
      
      <button 
    

        className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm flex flex-col items-center justify-center text-xl font-medium transition-colors"
        onClick={() => navigate('/edit-profile')}
      >
        Edytuj profil
      </button>
    </div>
  );
};