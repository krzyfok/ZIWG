import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorApi } from '../api';
import type { Doctor } from '../types';

export const DoctorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        if (id) {
          const result = await doctorApi.getDoctorById(id); 
          setDoctor(result);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania szczegółów lekarza:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  if (loading) return <div className="text-center py-10">Ładowanie danych...</div>;
  if (!doctor) return <div className="text-center py-10">Nie znaleziono lekarza.</div>;

  return (
    <div className="bg-white p-8 border rounded-md shadow-sm max-w-2xl mx-auto mt-6">
      <button 
        onClick={() => navigate(-1)} 
        className="text-blue-600 mb-6 hover:underline"
      >
        &larr; Powrót do listy
      </button>

      <div className="flex items-center gap-6 mb-8">
         <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0"></div>
         <div>
            <h1 className="text-2xl font-bold">{doctor.first_name} {doctor.last_name}</h1>
            <p className="text-lg text-gray-700">{doctor.specializations.join(' ,')}</p>
            <p className="text-gray-500">{doctor.city}</p>
         </div>
      </div>
      <div className="border-t pt-1">
        <p> {doctor.description}</p>
        <h2 className="text-xl font-semibold mb-4">Rezerwacja wizyty</h2>
        
        <button 
            onClick={() => navigate(`/doctor/${id}/appointments`)}
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full"
            >
            Zarezerwuj
            </button>
      </div>
    </div>
  );
};