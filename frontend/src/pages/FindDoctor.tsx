import React, { useState } from 'react';
import { doctorApi } from '../api';
import type { Doctor } from '../types';

export const FindDoctor: React.FC = () => {
  const [specialization, setSpecialization] = useState('');
  const [city, setCity] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await doctorApi.searchDoctors(specialization, city);
    setDoctors(results);
  };

  return (
        <>
      <div className="bg-white p-6 border rounded-md shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Specjalizacja</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded" 
              placeholder="np. Kardiolog"
              value={specialization} onChange={e => setSpecialization(e.target.value)}
            />
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
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div> {/* Zdjęcie lekarza */}
                <div>
                  <h3 className="font-semibold text-lg">{doc.name}</h3>
                  <p className="text-gray-600">{doc.specialization} • {doc.city}</p>
                </div>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Zarezerwuj wizytę
              </button>
            </div>
          ))
        )}
      </div>
</>
   
  );
};