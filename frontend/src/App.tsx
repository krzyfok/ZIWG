import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Appointments } from './pages/Appointments';
import { FindDoctor } from './pages/FindDoctor';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Navbar } from './components/Navbar';
import { DoctorDetails } from './pages/DoctorDetail';
import { DoctorAppointments } from './pages/DoctorAppointments';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { EditDoctorProfile } from './pages/EditDoctorProfile';
import {EditDoctorAppointments} from './pages/EditDoctorAppointments';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/find-doctor" element={<FindDoctor />} />
              <Route path="/doctor/:id" element={<DoctorDetails />} />
              <Route path="/doctor/:id/appointments" element={<DoctorAppointments />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route element={<Layout />}>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/edit-profile" element={<EditDoctorProfile />} />
              <Route path="/manage-appointments" element={<EditDoctorAppointments />}/>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;