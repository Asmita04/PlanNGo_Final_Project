import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, notifications } = useApp();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
    <nav className={`navbar ${isExpanded ? 'expanded' : 'collapsed'}`} style={{ background: 'rgba(203, 255, 71, 1)' }}>
      <div className="container">
        <div className="navbar-content">
          <button 
            className="navbar-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Calendar size={32} />
            <span>PlanNGo</span>
            <ChevronDown size={20} className={`chevron ${isExpanded ? 'rotated' : ''}`} />
          </button>

          {isExpanded && (
            <>
              <div className="navbar-links">
                {(!user || (user.userRole !== 'ROLE_ADMIN')) && (
                  <Link to="/events">Events</Link>
                )}
                {!user && (
                  <>
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact Us</Link>
                  </>
                )}
                {user && user.userRole && user.userRole === 'ROLE_ADMIN' && (
                  <>
                    <Link to="/admin/event-management">Event Management</Link>
                    <Link to="/admin/venue-management">Venue Management</Link>
                    <Link to="/admin/user-management">User Management</Link>
                  </>
                )}
                {user && <Link to={getDashboardLink()}>Dashboard</Link>}
                {!user && <Link to="/login">Login</Link>}
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
                        {user.userRole && user.userRole === 'ROLE_CUSTOMER' && (
                          <Link to="/user/profile">
                            <User size={16} /> Profile
                          </Link>
                        )}
                        {user.userRole && user.userRole === 'ROLE_ORGANIZER' && (
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
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
