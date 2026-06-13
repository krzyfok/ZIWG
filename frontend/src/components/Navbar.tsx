import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentApi } from '../api';
import type { Notification } from '../types';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-gray-700 hover:text-blue-600 ${isActive ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''}`;

export function Navbar() {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  const fetchNotifications = async () => {
    if (!user?.id || user.role !== 'patient') return;

    try {
      const data = await appointmentApi.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Błąd podczas pobierania powiadomień', error);
    }
  };

  const handleReadNotification = async (notificationId: number) => {
    if (!user?.id) return;

    try {
      await appointmentApi.markNotificationRead(user.id, notificationId);
      setNotifications((prev) => prev.map((notification) =>
        notification.id === notificationId ? { ...notification, is_read: true } : notification
      ));
    } catch (error) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytanego', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

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
            <NavLink to="/doctor-dashboard/appointments" className={navLinkClass}>
              Wyświetl wizyty
            </NavLink>
            <NavLink to="/doctor-dashboard/availability" className={navLinkClass}>
              Edytuj grafik
            </NavLink>
            <NavLink to="/doctor-dashboard/edit-profile" className={navLinkClass}>
              Edytuj profil
            </NavLink>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated && user?.role === 'patient' && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="relative px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Powiadomienia
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-10">
                <div className="p-3 border-b text-sm font-semibold">Powiadomienia</div>
                {notifications.length === 0 ? (
                  <div className="p-3 text-gray-500">Brak powiadomień.</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b last:border-b-0 ${notification.is_read ? 'bg-white' : 'bg-blue-50'}`}
                    >
                      <div className="text-sm text-gray-800">{notification.message}</div>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(notification.created_at).toLocaleString('pl-PL')}</span>
                        {!notification.is_read && (
                          <button
                            onClick={() => handleReadNotification(notification.id)}
                            className="text-blue-600 hover:underline"
                          >
                            Oznacz jako przeczytane
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Wyloguj
          </button>
        )}
      </div>
    </nav>
  );
}

