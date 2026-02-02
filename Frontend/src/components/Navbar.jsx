import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user || !user.userRole) return '/login';
    if (user.userRole === 'ROLE_ADMIN') return '/admin/dashboard';
    if (user.userRole === 'ROLE_ORGANIZER') return '/organizer/dashboard';
    return '/user/dashboard';
  };

  return (
    <nav className="fixed top-2 sm:top-3 md:top-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] max-w-6xl backdrop-blur-xl bg-white/20 border border-white/20 rounded-xl md:rounded-2xl shadow-xl z-50 px-3 sm:px-4 md:px-6 py-2 md:py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl font-bold text-teal-500 flex-shrink-0">
          <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          <span>PlanNGo</span>
        </Link>

        {/* Navigation Links - Responsive */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-8 flex-1 justify-center overflow-x-auto scrollbar-hide">
          {(!user || (user.userRole !== 'ROLE_ADMIN')) && (
            <Link to="/events" className="font-medium text-white hover:text-teal-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10 whitespace-nowrap text-xs sm:text-sm md:text-base">
              Events
            </Link>
          )}
          {!user && (
            <>
              <Link to="/about" className="hidden sm:inline-block font-medium text-white hover:text-teal-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10 whitespace-nowrap text-xs sm:text-sm md:text-base">
                About
              </Link>
              <Link to="/contact" className="hidden md:inline-block font-medium text-white hover:text-teal-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10 whitespace-nowrap text-xs sm:text-sm md:text-base">
                Contact
              </Link>
            </>
          )}
          {user && user.userRole && user.userRole === 'ROLE_ADMIN' && (
            <>
              <Link to="/admin/event-management" className="font-medium text-white hover:text-teal-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10 whitespace-nowrap text-xs sm:text-sm md:text-base">
                Events
              </Link>
              <Link to="/admin/venue-management" className="hidden sm:inline-block font-medium text-white hover:text-teal-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10 whitespace-nowrap text-xs sm:text-sm md:text-base">
                Venues
              </Link>
              <Link to="/admin/user-management" className="hidden md:inline-block font-medium text-white hover:text-teal-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10 whitespace-nowrap text-xs sm:text-sm md:text-base">
                Users
              </Link>
            </>
          )}
          {user && (
            <Link to={getDashboardLink()} className="font-medium text-white hover:text-teal-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10 whitespace-nowrap text-xs sm:text-sm md:text-base">
              Dashboard
            </Link>
          )}
          {!user && (
            <Link to="/login" className="font-medium text-white hover:text-teal-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10 whitespace-nowrap text-xs sm:text-sm md:text-base">
              Login
            </Link>
          )}
        </div>

        {/* User Menu - Responsive */}
        {user && (
          <div className="relative group flex-shrink-0">
            <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-white hover:bg-white/10 transition-colors">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:block text-xs sm:text-sm md:text-base">{user.name}</span>
            </button>
            <div className="absolute top-full right-0 mt-2 min-w-[160px] sm:min-w-[180px] bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              {user.userRole && user.userRole === 'ROLE_CUSTOMER' && (
                <Link to="/user/profile" className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-gray-800 hover:bg-gray-50 transition-colors rounded-t-xl md:rounded-t-2xl text-xs sm:text-sm md:text-base">
                  <User className="w-4 h-4" /> Profile
                </Link>
              )}
              {user.userRole && user.userRole === 'ROLE_ORGANIZER' && (
                <Link to="/organizer/profile" className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-gray-800 hover:bg-gray-50 transition-colors rounded-t-xl md:rounded-t-2xl text-xs sm:text-sm md:text-base">
                  <User className="w-4 h-4" /> Profile
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-gray-800 hover:bg-gray-50 transition-colors rounded-b-xl md:rounded-b-2xl text-xs sm:text-sm md:text-base">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
