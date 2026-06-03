import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-gray-700 hover:text-blue-600 ${isActive ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''}`;

export function Navbar() {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="p-3 flex items-center justify-between bg-white border-b shadow-sm">
      <div className="flex items-center space-x-8">
        <NavLink
          to={isAuthenticated ? '/dashboard' : '/'}
          className="text-xl font-bold text-blue-600"
        >
          TwójLekarz.pl
        </NavLink>
        {isAuthenticated && user?.role == "patient" &&(
          <div className="flex items-center space-x-4">
            <NavLink to="/find-doctor" className={navLinkClass}>
              Znajdź Lekarza
            </NavLink>
            <NavLink to="/appointments" className={navLinkClass}>
              Wizyty
            </NavLink>
          </div>
        )}
        {isAuthenticated && user?.role == "doctor" &&(
          <div className="flex items-center space-x-4">
            <NavLink to="/doctor-appointment" className={navLinkClass}>
              Twój grafik przyjęć
            </NavLink>
            <NavLink to="/edit-profile" className={navLinkClass}>
              Edytuj profil
            </NavLink>
          </div>
        )}
      </div>
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Wyloguj
        </button>
      )}
    </nav>
  );
}

