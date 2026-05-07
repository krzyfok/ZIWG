import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    
      <div className="flex flex-col sm:flex-row gap-6 mt-10 justify-center">
        <button 
          onClick={() => navigate('/appointments')}
          className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm flex items-center justify-center text-xl font-medium transition-colors"
        >
          Twoje wizyty
        </button>
        <button 
          onClick={() => navigate('/find-doctor')}
          className="w-64 h-48 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg shadow-sm flex items-center justify-center text-xl font-medium transition-colors"
        >
          Znajdź lekarza
        </button>
      </div>
    
  );
};