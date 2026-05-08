import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorApi, appointmentApi } from '../api';
import type { AppointmentSlot } from '../types';
import { useAuth } from '../context/AuthContext';

export const DoctorAppointments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        if (id) {
          const results = await appointmentApi.getAvailableSlots(id);
          
          const availableOnly = results.filter(slot => slot.is_available);
          setSlots(availableOnly);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania terminów:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [id]);

  const groupSlotsByDate = (slotsList: AppointmentSlot[]) => {
    return slotsList.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {} as Record<string, AppointmentSlot[]>);
  };

  const handleBooking = (slotId: number) => {
    console.log(`Rezerwuję termin o ID: ${slotId}`);
    appointmentApi.bookAppointment(userId,slotId)
    alert('Rezerwacja w trakcie realizacji...');
  };

  if (loading) return <div className="text-center py-10">Ładowanie wolnych terminów...</div>;

  const groupedSlots = groupSlotsByDate(slots);
  const dates = Object.keys(groupedSlots).sort(); 

  return (
    <div className="bg-white p-8 border rounded-md shadow-sm max-w-3xl mx-auto mt-6">
      <button 
        onClick={() => navigate(-1)} 
        className="text-blue-600 mb-6 hover:underline"
      >
        &larr; Powrót do profilu lekarza
      </button>

      <h1 className="text-2xl font-bold mb-6">Wybierz termin wizyty</h1>

      {dates.length === 0 ? (
        <p className="text-gray-500">Brak dostępnych terminów w najbliższym czasie.</p>
      ) : (
        <div className="space-y-8">
          {dates.map((date) => (
            <div key={date}>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                {new Date(date).toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
              <div className="flex flex-wrap gap-3">
                {groupedSlots[date]
                  .sort((a, b) => a.start_time.localeCompare(b.start_time)) 
                  .map((slot) => {
                    
                    const formattedTime = slot.start_time.slice(0, 5); 
                    
                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleBooking(slot.id)}
                        className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
                      >
                        {formattedTime}
                      </button>
                    );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};