import React, { useState, useEffect,useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../api';
import type { DoctorAppointmentDetails,AppointmentStatus } from '../types';

export const DoctorAppointmentSummary: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<DoctorAppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const isReadOnly = appointment ? appointment.status !== 'scheduled' : false;

  const [status, setStatus] = useState<AppointmentStatus>('scheduled');
  const [notes, setNotes] = useState('');

  const loadAppointment = useCallback(async () => {
    if (!id) {
      setError('Nieprawidłowy identyfikator wizyty.');
      setLoading(false);
      return;
    }

    if (!user?.id) return;

    try {
      setLoading(true); 
      const data = await adminApi.getSingleAppointment(user.id, Number(id));
      setAppointment(data);
      setStatus(data.status); 
      setNotes(data.medical_notes || '');
    } catch (err) {
      console.error('Błąd pobierania danych wizyty', err);
      setError('Nie udało się załadować danych wizyty.');
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]); 

    useEffect(() => {
        loadAppointment();
  }, [loadAppointment]);

   const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!user?.id || !appointment) return;
      try {
        await adminApi.updateAppointment(user.id, Number(id), status, notes);
        
        setMessage('Zapisano zmiany!');
        await loadAppointment();
      } catch (error) {
        console.error("Błąd zapisu", error);
        setMessage('Wystąpił błąd podczas zapisywania.');
      }
    };

  if (loading) {
    return <div className="max-w-2xl mx-auto mt-10">Ładowanie...</div>;
  }

  if (error || !appointment) {
    return <div className="max-w-2xl mx-auto mt-10 text-red-600">{error || 'Nie znaleziono wizyty'}</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  if (!appointment) {
    return (
      <div className="mt-10 text-center text-gray-500 font-medium">
        Pobieranie danych wizyty...
      </div>
    );
  }
 return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
    {message && <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">{message}</div>}
      <h2 className="text-2xl font-bold mb-6">Podsumowanie wizyty</h2>
      
      <div className="flex flex-col gap-5">
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pacjent</label>
            <p className="border p-2 rounded bg-gray-50">{appointment.patient_name}</p>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon pacjenta</label>
            <p className="border p-2 rounded bg-gray-50">{appointment.patient_phone}</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <p className="border p-2 rounded bg-gray-50">{formatDate(appointment.date)}</p>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Godzina</label>
            <p className="border p-2 rounded bg-gray-50">{appointment.start_time} - {appointment.end_time}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
            <p className="border p-2 rounded bg-gray-50">{appointment.patient_address || 'Brak danych'}</p>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status wizyty</label>
            <select 
              className="w-full border p-2 rounded bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              value={status} 
              disabled={isReadOnly}
              onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
            >
              <option value="scheduled">Zaplanowana</option>
              <option value="completed">Zakończona</option>
              <option value="no_show">Pacjent nie stawił się</option>
              <option value="cancelled">Odwołana</option>
            </select>
          </div>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notatki medyczne (Wywiad, diagnoza, zalecenia)
          </label>
          <textarea 
            className="w-full border p-3 rounded focus:outline-none focus:border-blue-500 min-h-[150px] resize-y"
            placeholder="Wprowadź przebieg wizyty..."
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            disabled={isReadOnly}
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <button 
            type="button" 
            onClick={() => navigate('/doctor-dashboard/appointments')} 
            className="px-4 py-2 border text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            {isReadOnly ? 'Wróć' : 'Anuluj'}
          </button>
          
          {!isReadOnly && (
            <button 
              type="button" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
              onClick={handleUpdate}
            >
              Zapisz podsumowanie
          </button>
          )}
        </div>
        
      </div>
    </div>
  );
};