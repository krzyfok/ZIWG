import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { appointmentApi } from '../api';
import type { AppointmentSlot } from '../types';
import { useAuth } from '../context/AuthContext';

export const DoctorAppointments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId')
    ? parseInt(searchParams.get('appointmentId') as string, 10)
    : undefined;
  const isRescheduling = Boolean(appointmentId);
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

  const handleReschedule = async (slotId: number) => {
    if (!appointmentId) {
      return;
    }

    try {
      await appointmentApi.rescheduleAppointment(appointmentId, slotId);
      alert('Termin wizyty został pomyślnie zmieniony!');
      navigate('/appointments');
    } catch (error) {
      alert('Wystąpił błąd przy zmianie terminu. Proszę spróbować ponownie.');
    }
  };

const handleBooking = async (slotId: number) => {
  if (!userId) {
    alert("Błąd: Nie znaleziono danych użytkownika. Zaloguj się ponownie.");
    return;
  }

  try {
    await appointmentApi.bookAppointment(userId, slotId);
    alert('Wizyta została pomyślnie zarezerwowana!');
    navigate('/appointments');
  } catch (error) {
    alert('Wystąpił błąd przy rezerwacji terminu. Proszę spróbować ponownie.');
  }
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
        &larr; {isRescheduling ? 'Anuluj zmianę terminu' : 'Powrót do profilu lekarza'}
      </button>

      <h1 className="text-2xl font-bold mb-6">
        {isRescheduling ? 'Wybierz nowy termin wizyty' : 'Wybierz termin wizyty'}
      </h1>

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
                        onClick={() => isRescheduling ? handleReschedule(slot.id) : handleBooking(slot.id)}
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