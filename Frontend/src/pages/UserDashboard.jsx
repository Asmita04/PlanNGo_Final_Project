import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { Ticket, User, Heart, Download, Calendar, MapPin } from 'lucide-react';
import Button from '../components/Button';
import './Dashboard.css';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await api.getUserBookings(user.id);
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = (booking) => {
    alert(`Downloading ticket: ${booking.ticketNumber}`);
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>My Dashboard</h1>
            <p>Welcome back, {user.name}!</p>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            <Ticket size={20} />
            My Bookings
          </button>
          <button
            className={activeTab === 'favorites' ? 'active' : ''}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={20} />
            Favorites
          </button>
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            Profile
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <h2>My Bookings</h2>
              {loading ? (
                <p>Loading bookings...</p>
              ) : bookings.length === 0 ? (
                <div className="empty-state">
                  <Ticket size={64} />
                  <h3>No bookings yet</h3>
                  <p>Start exploring events and book your first ticket!</p>
                  <Button onClick={() => window.location.href = '/events'}>Browse Events</Button>
                </div>
              ) : (
                <div className="bookings-grid">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <img src={booking.event.image} alt={booking.event.title} />
                      <div className="booking-info">
                        <h3>{booking.event.title}</h3>
                        <div className="booking-detail">
                          <Calendar size={16} />
                          <span>{new Date(booking.event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="booking-detail">
                          <MapPin size={16} />
                          <span>{booking.event.location}</span>
                        </div>
                        <div className="booking-meta">
                          <span className="ticket-number">#{booking.ticketNumber}</span>
                          <span className="ticket-count">{booking.quantity} Tickets</span>
                        </div>
                        <Button
                          size="sm"
                          fullWidth
                          icon={<Download size={16} />}
                          onClick={() => handleDownloadTicket(booking)}
                        >
                          Download Ticket
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites-section">
              <h2>Favorite Events</h2>
              <div className="empty-state">
                <Heart size={64} />
                <h3>No favorites yet</h3>
                <p>Save events you're interested in to find them easily later</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Information</h2>
              <div className="profile-card">
                <div className="profile-avatar">
                  <img src={user.avatar} alt={user.name} />
                </div>
                <div className="profile-info">
                  <div className="info-group">
                    <label>Full Name</label>
                    <p>{user.name}</p>
                  </div>
                  <div className="info-group">
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                  <div className="info-group">
                    <label>Phone</label>
                    <p>{user.phone}</p>
                  </div>
                  <div className="info-group">
                    <label>Account Type</label>
                    <p className="role-badge">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
