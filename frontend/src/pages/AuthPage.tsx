import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // try {
    //   if (isLogin) {
    //     await api.login(email, password);
    //   } else {
    //     await api.register(email, password);
    //   }
    //   navigate('/dashboard');
    // } catch (error) {
    //   console.error("Błąd autoryzacji", error);
    // }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 border shadow-md w-96 rounded-md">
        <div className="flex mb-6 border-b">
          <button 
            className={`flex-1 pb-2 font-semibold ${isLogin ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setIsLogin(true)}
          >
            Logowanie
          </button>
          <button 
            className={`flex-1 pb-2 font-semibold ${!isLogin ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setIsLogin(false)}
          >
            Rejestracja
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="border p-2 rounded"
            value={email} onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Hasło" 
            className="border p-2 rounded"
            value={password} onChange={e => setPassword(e.target.value)}
          />
          {!isLogin && (
             <input type="password" placeholder="Powtórz hasło" className="border p-2 rounded" />
          )}
          <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700">
            {isLogin ? 'Zaloguj' : 'Zarejestruj'}
          </button>
        </form>
      </div>
      <div className="mt-8 text-sm text-gray-500">Stopka strony</div>
    </div>
  );
};