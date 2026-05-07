import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, showBack = true }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          {showBack && (
             <button onClick={() => navigate(-1)} className="text-sm border px-2 py-1 rounded hover:bg-gray-100">
               &larr; Wróć
             </button>
          )}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-gray-400"></div> {/* Ikona profilu */}
      </header>

      <main className="flex-grow p-6 max-w-4xl mx-auto w-full">
        {children}
      </main>

      <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
        Stopka strony
      </footer>
    </div>
  );
};