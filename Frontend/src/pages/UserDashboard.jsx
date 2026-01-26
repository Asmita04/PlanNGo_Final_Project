import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { Ticket, User, Heart, Download, Calendar, MapPin, Edit } from 'lucide-react';
import Button from '../components/Button';
import './Dashboard.css';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Split full name into first and last name
  const getNameParts = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    console.log('Name parts:', { fullName, firstName, lastName }); // Debug log
    return { firstName, lastName };
  };

  const { firstName, lastName } = getNameParts(user?.name);

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
            <h1>🎯 My Dashboard</h1>
            <p>Welcome back, <strong>{user.name}</strong>! 🚀</p>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            <Ticket size={20} />
            🎫 My Bookings
          </button>
          <button
            className={activeTab === 'favorites' ? 'active' : ''}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={20} />
            ❤️ Favorites
          </button>
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            👤 Profile
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <h2>🎫 My Event Bookings</h2>
              {loading ? (
                <p>Loading bookings...</p>
              ) : bookings.length === 0 ? (
                <div className="empty-state">
                  <Ticket size={64} />
                  <h3>🎪 No bookings yet!</h3>
                  <p>Ready to discover amazing events? Let's get you started! ✨</p>
                  <Button onClick={() => window.location.href = '/events'}>🔍 Browse Events</Button>
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
              <h2>❤️ Favorite Events</h2>
              <div className="empty-state">
                <Heart size={64} />
                <h3>💝 No favorites yet!</h3>
                <p>Save events you love to find them easily later 🌟</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="profile-header">
                <h2>👤 Profile Information</h2>
                <button className="edit-btn-circle">
                  <Edit size={16} />
                </button>
              </div>
              <div className="profile-card">
                <div className="profile-avatar">
                  <img src={user.avatar || 'https://via.placeholder.com/100'} alt={user.name} />
                </div>
                <div className="profile-info">
                  <div className="name-row" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                    <div className="info-group">
                      <label>👤 First Name</label>
                      <p>{firstName || 'Test'}</p>
                    </div>
                    <div className="info-group">
                      <label>👤 Last Name</label>
                      <p>{lastName || 'User'}</p>
                    </div>
                  </div>
                  <div className="info-group">
                    <label>📧 Email Address</label>
                    <p>{user.email}</p>
                  </div>
                  <div className="info-group">
                    <label>📱 Phone Number</label>
                    <p>{user.phone || 'Not provided'}</p>
                  </div>
                  <div className="info-group">
                    <label>🏷️ Account Type</label>
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
