import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [errorMsg, setErrorMsg] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isLogin && password !== confirmPassword) {
      setErrorMsg("Hasła nie są identyczne!");
      return;
    }

    try {
      let userData;

      if (isLogin) {
        userData = await authApi.login({username, password});
      } else {
        userData = await authApi.register({username, password, name, surname, phone, address});
      }

      login(userData);
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Błąd autoryzacji", error);
      setErrorMsg(error.response?.data?.detail || "Wystąpił błąd podczas autoryzacji");
    }
   
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setErrorMsg('');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 border shadow-md w-96 rounded-md">
        <div className="flex mb-6 border-b">
          <button 
            className={`flex-1 pb-2 font-semibold ${isLogin ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => {
              resetForm();
              setIsLogin(true);
            }}
          >
            Logowanie
          </button>
          <button 
            className={`flex-1 pb-2 font-semibold ${!isLogin ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => {
              resetForm();
              setIsLogin(false);
            }}
          >
            Rejestracja
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {!isLogin && (
            <>
             <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Imię</label>
                <input 
                  type="text" 
                  className="border p-2 rounded focus:outline-none focus:border-blue-500" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Nazwisko</label>
                <input 
                  type="text" 
                  className="border p-2 rounded focus:outline-none focus:border-blue-500" 
                  value={surname}
                  onChange={e => setSurname(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Numer telefonu</label>
                <input 
                  type="number" 
                  className="border p-2 rounded focus:outline-none focus:border-blue-500" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Adres</label>
                <input 
                  type="text" 
                  className="border p-2 rounded focus:outline-none focus:border-blue-500" 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
            </>
          )}
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nazwa użytkownika</label>
            <input 
              type="text" 
              className="border p-2 rounded focus:outline-none focus:border-blue-500"
              value={username} onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Hasło</label>
            <input 
              type="password" 
              className="border p-2 rounded focus:outline-none focus:border-blue-500"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
           {!isLogin && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Powtórz hasło</label>
                <input 
                  type="password"
                  className="border p-2 rounded focus:outline-none focus:border-blue-500"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          )}
          {errorMsg && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              {errorMsg}
            </div>
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