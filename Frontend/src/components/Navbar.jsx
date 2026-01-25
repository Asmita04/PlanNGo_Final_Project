import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, notifications } = useApp();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'organizer') return '/organizer/dashboard';
    return '/user/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <Calendar size={32} />
            <span>PlanNGo</span>
          </Link>

          <div className={`navbar-links ${showMenu ? 'active' : ''}`}>
            <Link to="/events" onClick={() => setShowMenu(false)}>Events</Link>
            <Link to="/about" onClick={() => setShowMenu(false)}>About Us</Link>
            <Link to="/contact" onClick={() => setShowMenu(false)}>Contact Us</Link>
            {user && user.role === 'admin' && (
              <>
                <Link to="/admin/events" onClick={() => setShowMenu(false)}>Event Approval</Link>
                <Link to="/admin/organizers" onClick={() => setShowMenu(false)}>Organizer Verification</Link>
              </>
            )}
            {user && <Link to={getDashboardLink()} onClick={() => setShowMenu(false)}>Dashboard</Link>}
            {!user && <Link to="/login" onClick={() => setShowMenu(false)}>Login</Link>}
          </div>

          <div className="navbar-actions">
            {user && (
              <>
                <div className="notification-wrapper">
                  <button 
                    className="icon-btn notification-btn" 
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                      <span className="notification-badge">{notifications.length}</span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="notification-dropdown">
                      <h4>Notifications</h4>
                      {notifications.length === 0 ? (
                        <p className="no-notifications">No new notifications</p>
                      ) : (
                        notifications.slice(0, 5).map(notif => (
                          <div key={notif.id} className="notification-item">
                            <p>{notif.message}</p>
                            <small>{new Date(notif.timestamp).toLocaleString()}</small>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="user-menu">
                  <button className="user-btn">
                    <User size={20} />
                    <span>{user.name}</span>
                  </button>
                  <div className="user-dropdown">
                    {user.role === 'client' && (
                      <Link to="/user/profile">
                        <User size={16} /> Profile
                      </Link>
                    )}
                    {user.role === 'organizer' && (
                      <Link to="/organizer/profile">
                        <User size={16} /> Profile
                      </Link>
                    )}
                    <button onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}

            <button className="mobile-menu-btn" onClick={() => setShowMenu(!showMenu)}>
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
