import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { Plus, Calendar, Users, DollarSign, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../components/Button';
import './Dashboard.css';
import './OrganizerDashboard.css';

const OrganizerDashboard = () => {
  const { user, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [locations, setLocations] = useState([]);
  const [venues, setVenues] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    date: '',
    time: '',
    venue: '',
    price: '',
    capacity: '',
    image: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get organizer ID from user context or fetch organizer data
      const organizerId = user.organizerId || 1; // Use actual organizer ID
      const organizerEvents = await api.getEventsByOrganizer(organizerId);
      setEvents(organizerEvents);
      
      // Fetch available venues
      const venuesData = await api.getAvailableVenues();
      setVenues(venuesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleVenueChange = (venueId) => {
    const selectedVenue = venues.find(v => v.venueId === parseInt(venueId));
    setFormData({ 
      ...formData, 
      venue: venueId,
      capacity: selectedVenue ? selectedVenue.capacity.toString() : ''
    });
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    const selectedVenue = venues.find(v => v.venueName === event.venueName);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: new Date(event.startDate).toISOString().split('T')[0],
      time: new Date(event.startDate).toTimeString().slice(0, 5),
      venue: selectedVenue ? selectedVenue.venueId.toString() : '',
      price: event.ticketPrice?.toString() || '',
      capacity: event.availableTickets?.toString() || '',
      image: event.eventImage || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: new Date(`${formData.date}T${formData.time}`).toISOString(),
        endDate: new Date(`${formData.date}T${formData.time}`).toISOString(),
        venueId: parseInt(formData.venue),
        ticketPrice: parseFloat(formData.price),
        availableTickets: parseInt(formData.capacity),
        eventImage: formData.image
      };
      
      console.log('Updating event:', editingEvent.eventId, eventData);
      await api.updateEvent(editingEvent.eventId, eventData);
      addNotification({ message: 'Event updated successfully!', type: 'success' });
      setShowEditModal(false);
      setEditingEvent(null);
      loadData();
      resetForm();
    } catch (error) {
      console.error('Update error:', error);
      addNotification({ message: `Failed to update event: ${error.message}`, type: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Technology',
      date: '',
      time: '',
      venue: '',
      price: '',
      capacity: '',
      image: ''
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: new Date(`${formData.date}T${formData.time}`).toISOString(),
        endDate: new Date(`${formData.date}T${formData.time}`).toISOString(),
        venueId: parseInt(formData.venue),
        ticketPrice: parseFloat(formData.price),
        availableTickets: parseInt(formData.capacity),
        eventImage: formData.image
      };
      
      await api.createEvent(eventData);
      addNotification({ message: 'Event created successfully!', type: 'success' });
      setShowCreateModal(false);
      loadData();
      resetForm();
    } catch (error) {
      addNotification({ message: 'Failed to create event', type: 'error' });
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        console.log('Deleting event:', id);
        await api.deleteEvent(id);
        addNotification({ message: 'Event deleted successfully!', type: 'success' });
        loadData();
      } catch (error) {
        console.error('Delete error:', error);
        addNotification({ message: `Failed to delete event: ${error.message}`, type: 'error' });
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Organizer Dashboard</h1>
            <p>Manage your events and track performance</p>
          </div>
          <Button icon={<Plus size={20} />} onClick={() => setShowCreateModal(true)}>
            Create Event
          </Button>
        </div>

        <div className="dashboard-tabs">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            <TrendingUp size={20} />
            Overview
          </button>
          <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>
            <Calendar size={20} />
            My Events
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && analytics && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#ede9fe' }}>
                    <Calendar size={24} color="#6366f1" />
                  </div>
                  <div className="stat-info">
                    <p>Total Events</p>
                    <h3>{analytics.totalEvents}</h3>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#dbeafe' }}>
                    <Users size={24} color="#3b82f6" />
                  </div>
                  <div className="stat-info">
                    <p>Total Bookings</p>
                    <h3>{analytics.totalBookings}</h3>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#d1fae5' }}>
                    <DollarSign size={24} color="#10b981" />
                  </div>
                  <div className="stat-info">
                    <p>Total Revenue</p>
                    <h3>${analytics.totalRevenue.toLocaleString()}</h3>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#fef3c7' }}>
                    <TrendingUp size={24} color="#f59e0b" />
                  </div>
                  <div className="stat-info">
                    <p>Avg Rating</p>
                    <h3>{analytics.averageRating}</h3>
                  </div>
                </div>
              </div>

              <div className="chart-section">
                <h3>Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-section">
              <h2>My Events</h2>
              {events.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={64} />
                  <h3>No events yet</h3>
                  <p>Create your first event to get started</p>
                  <Button onClick={() => setShowCreateModal(true)}>Create Event</Button>
                </div>
              ) : (
                <div className="events-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Total Tickets</th>
                        <th>Ticket Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(event => (
                        <tr key={event.eventId}>
                          <td>
                            <div className="event-cell">
                              <img src={event.eventImage || '/placeholder.jpg'} alt={event.title} />
                              <span>{event.title}</span>
                            </div>
                          </td>
                          <td>{new Date(event.startDate).toLocaleDateString()}</td>
                          <td>{event.venueName}</td>
                          <td>{event.availableTickets}</td>
                          <td>₹{event.ticketPrice}</td>
                          <td>
                            <span className={`status-badge ${event.isApproved ? 'approved' : 'pending'}`}>
                              {event.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="icon-btn" onClick={() => handleEditEvent(event)}>
                                <Edit size={16} />
                              </button>
                              <button className="icon-btn danger" onClick={() => handleDeleteEvent(event.eventId)}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setEditingEvent(null);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
            <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="event-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Event Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option>Technology</option>
                    <option>Music</option>
                    <option>Sports</option>
                    <option>Food</option>
                    <option>Art</option>
                    <option>Business</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows="3" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Venue</label>
                  <select value={formData.venue} onChange={(e) => handleVenueChange(e.target.value)} required>
                    <option value="">Select Venue</option>
                    {venues.map(venue => (
                      <option key={venue.venueId} value={venue.venueId}>
                        {venue.venueName} - {venue.location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required readOnly />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="modal-actions">
                <Button type="button" variant="outline" onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingEvent(null);
                }}>Cancel</Button>
                <Button type="submit">{editingEvent ? 'Update Event' : 'Create Event'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
