import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doctorProfile } from '../api/doctorProfile'; 

export const EditDoctorProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    city: '',
    address: '',
    description: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        try {
          const data = await doctorProfile.getMyProfile(user.id);
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            city: data.city || '',
            address: data.address || '',
            description: data.description || '',
            phone: data.phone || '',
            email: data.email || ''
          });
        } catch (error) {
          console.error("Błąd pobierania danych", error);
        }
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;

    try {
      await doctorProfile.updateMyProfile(user.id, formData);
      
      setMessage('Zapisano zmiany!');
      setTimeout(() => navigate('/doctor-dashboard'), 2000); 
      
    } catch (error) {
      console.error("Błąd zapisu", error);
      setMessage('Wystąpił błąd podczas zapisywania.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edytuj swój profil</h2>
      
      {message && <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">{message}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <input className="border p-2 rounded w-full" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Imię" required />
          <input className="border p-2 rounded w-full" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Nazwisko" required />
        </div>
        
        <div className="flex gap-4">
          <input className="border p-2 rounded w-full" name="city" value={formData.city} onChange={handleChange} placeholder="Miasto" required />
          <input className="border p-2 rounded w-full" name="address" value={formData.address} onChange={handleChange} placeholder="Adres gabinetu" required />
        </div>

        <div className="flex gap-4">
          <input className="border p-2 rounded w-full" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon" />
          <input className="border p-2 rounded w-full" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" />
        </div>

        <textarea className="border p-2 rounded w-full h-32" name="description" value={formData.description} onChange={handleChange} placeholder="O mnie / Opis doświadczenia" />

        <div className="flex justify-end gap-4 mt-4">
          <button type="button" onClick={() => navigate('/doctor-dashboard')} className="px-4 py-2 text-gray-500 hover:text-gray-700">Anuluj</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Zapisz profil</button>
        </div>
      </form>
    </div>
  );
};