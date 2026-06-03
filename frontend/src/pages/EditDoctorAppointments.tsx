import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../api';

interface Availability {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export const EditDoctorAppointments: React.FC = () => {
  const { user } = useAuth();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
    end_time: ''
  });


const fetchAvailabilities = async () => {
  if (user?.id) {
    try {

      const data = await adminApi.getMyAvailability(user.id);
      
      if (Array.isArray(data)) {
        setAvailabilities(data);
      }
    } catch (error) {
      console.error("Błąd pobierania grafiku", error);
    }
  }
};

useEffect(() => {
  fetchAvailabilities();
}, [user]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!user?.id) return;

  try {
    await adminApi.createAvailability(user.id, formData);

    setFormData({ date: '', start_time: '', end_time: '' }); 
    fetchAvailabilities(); 
    
  } catch (error) {
    console.error("Błąd dodawania terminu", error);
  }
};

const handleDelete = async (availabilityId: number) => {
  if (!window.confirm("Na pewno usunąć ten termin?")) return;

  try {
    await adminApi.deleteAvailability(availabilityId);
    
    fetchAvailabilities(); 
    
  } catch (error) {
    console.error("Błąd usuwania terminu", error);
  }
};

  return (
    <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div className="bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-xl font-bold mb-4">Dodaj nowy termin</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="border p-2 rounded w-full"
              required 
            />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">Od</label>
              <input 
                type="time" 
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                className="border p-2 rounded w-full"
                required 
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">Do</label>
              <input 
                type="time" 
                value={formData.end_time}
                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                className="border p-2 rounded w-full"
                required 
              />
            </div>
          </div>
          <button type="submit" className="mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-medium">
            Dodaj do grafiku
          </button>
        </form>
      </div>

      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Twoje nadchodzące terminy</h2>
        {availabilities.length === 0 ? (
          <p className="text-gray-500">Twój grafik jest pusty.</p>
        ) : (
          <ul className="divide-y">
            {availabilities.map((slot) => (
              <li key={slot.id} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-semibold">{slot.date}</span>
                  <span className="ml-4 text-gray-600">{slot.start_time.slice(0,5)} - {slot.end_time.slice(0,5)}</span>
                  {!slot.is_available && (
                    <span className="ml-4 text-sm bg-red-100 text-red-700 px-2 py-1 rounded">Zarezerwowany</span>
                  )}
                </div>
                {slot.is_available && (
                <button 
                  onClick={() => handleDelete(slot.id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  Usuń
                </button>)}
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};