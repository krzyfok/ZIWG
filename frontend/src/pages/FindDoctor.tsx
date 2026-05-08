import React, { useState, useEffect } from 'react';
import { doctorApi } from '../api';
import type { Doctor, Specialization } from '../types';
import { useNavigate } from 'react-router-dom';

export const FindDoctor: React.FC = () => {
  const [specialization, setSpecialization] = useState('');
  const [city, setCity] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializationsList, setSpecializationsList] = useState<Specialization[]>([]);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await doctorApi.searchDoctors(specialization, city);
    setDoctors(results);
  };
  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const results = await doctorApi.getAllDoctors();
        setDoctors(results);
      } catch (error) {
        console.error("Błąd podczas pobierania lekarzy:", error);
      }
    };

    fetchAllDoctors();
  }, []);
  useEffect(()=> {
    const fetchSpecializations = async () =>{
      try {
        const results = await doctorApi.getSpecializations();
        setSpecializationsList(results);
      }catch (error) {
        console.error("Błąd podczas pobierania specjalizacji", error);
      }
    };
    fetchSpecializations();
  }, []);
  
  return (
        <>
      <div className="bg-white p-6 border rounded-md shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Specjalizacja</label>
            <select 
              className="w-full border p-2 rounded bg-white" 
              value={specialization} 
              onChange={e => setSpecialization(e.target.value)}
            >
              <option value="">Wszystkie specjalizacje</option>
              
              {specializationsList.map((spec) => (
                <option key={spec.id} value={spec.name}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Miasto</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded" 
              placeholder="np. Warszawa"
              value={city} onChange={e => setCity(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 h-10">
            Szukaj
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {doctors.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-white border rounded">Wpisz kryteria i kliknij Szukaj, aby znaleźć lekarzy.</p>
        ) : (
          doctors.map(doc => (
            <div key={doc.id} className="bg-white p-4 border rounded shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div> {/* Zdjęcie lekarza -???? jak?? */}
                
                  <h3 className="font-bold text-lg">{doc.first_name} {doc.last_name}</h3>
                  <h3 className="text-lg">{doc.specializations.join(' ,')}</h3> 
                  <p className="text-gray-600"> • {doc.city}</p>
             
              </div>
             <button 
                onClick={() => navigate(`/doctor/${doc.id}`)} 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Zarezerwuj wizytę
              </button>
            </div>
          ))
        )}
      </div>
</>
   
  );
};