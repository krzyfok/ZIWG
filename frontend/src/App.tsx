import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Appointments } from './pages/Appointments';
import { FindDoctor } from './pages/FindDoctor';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
    <Router>
       <Navbar/>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/find-doctor" element={<FindDoctor />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;