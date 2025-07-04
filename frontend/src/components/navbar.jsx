import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Car, LogOut, User, Wrench } from 'lucide-react';

const Navbar = () => {
  const { isLoggedIn, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
          <Car className="mr-2" />
          Wypożyczalnia
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/cars" className="text-gray-600 hover:text-blue-600">Samochody</Link>
          {isLoggedIn ? (
            <>
              <span className="text-gray-700 font-semibold">
                Witaj, {user.username}! (Punkty: {user.points})
              </span>
              <Link to="/my-bookings" className="text-gray-600 hover:text-blue-600">Moje rezerwacje</Link>
              {isAdmin && <Link to="/admin" className="text-gray-600 hover:text-blue-600 flex items-center"><Wrench size={16} className="mr-1"/>Panel Admina</Link>}
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center">
                <LogOut size={16} className="mr-1"/> Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Logowanie</Link>
              <Link to="/register" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Rejestracja</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;