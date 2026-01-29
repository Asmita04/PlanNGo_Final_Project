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
  const [venues, setVenues] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [step, setStep] = useState(1); // 1 = Event details, 2 = Ticket details

  // Event state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    startDateTime: '',
    endDateTime: '',
    venue: '',
    image: ''
  });

  // Ticket state
  const [tickets, setTickets] = useState([
    { type: 'GOLD', price: '', quantity: '' },
    { type: 'SILVER', price: '', quantity: '' },
    { type: 'PLATINUM', price: '', quantity: '' }
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const organizerId = user.organizerId || 1;
      const organizerEvents = await api.getEventsByOrganizer(organizerId);
      setEvents(organizerEvents);
      
      const venuesData = await api.getAllVenues();
      setVenues(venuesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleVenueChange = (venueId) => {
    setFormData({ ...formData, venue: venueId });
  };

  const handleTicketChange = (index, field, value) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Technology',
      startDateTime: '',
      endDateTime: '',
      venue: '',
      image: ''
    });
    setTickets([
      { type: 'GOLD', price: '', quantity: '' },
      { type: 'SILVER', price: '', quantity: '' },
      { type: 'PLATINUM', price: '', quantity: '' }
    ]);
    setStep(1);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: new Date(formData.startDateTime).toISOString(),
        endDate: new Date(formData.endDateTime).toISOString(),
        venueId: Number(formData.venue),
        eventImage: formData.image,
        tickets: tickets.map(t => ({
          ticketType: t.type,
          price: Number(t.price),
          totalQuantity: Number(t.quantity)
        }))
      };

      console.log("Final Event Payload:", eventData);

      await api.createEvent(eventData);
      addNotification({ message: 'Event created successfully!', type: 'success' });

      setShowCreateModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Create Event Error:", error);
      addNotification({ message: 'Failed to create event', type: 'error' });
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    const selectedVenue = venues.find(v => v.venueName === event.venueName);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      startDateTime: new Date(event.startDate).toISOString().slice(0,16),
      endDateTime: new Date(event.endDate).toISOString().slice(0,16),
      venue: selectedVenue ? selectedVenue.venueId.toString() : '',
      image: event.eventImage || ''
    });

    // Pre-fill tickets if available
    if(event.tickets && event.tickets.length > 0){
      const updatedTickets = tickets.map(t => {
        const existing = event.tickets.find(et => et.ticketType === t.type);
        return existing ? { ...t, price: existing.price, quantity: existing.totalQuantity } : t;
      });
      setTickets(updatedTickets);
    }

    setShowEditModal(true);
    setStep(1);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: new Date(formData.startDateTime).toISOString(),
        endDate: new Date(formData.endDateTime).toISOString(),
        venueId: Number(formData.venue),
        eventImage: formData.image,
        tickets: tickets.map(t => ({
          ticketType: t.type,
          price: Number(t.price),
          totalQuantity: Number(t.quantity)
        }))
      };

      await api.updateEvent(editingEvent.eventId, eventData);
      addNotification({ message: 'Event updated successfully!', type: 'success' });

      setShowEditModal(false);
      setEditingEvent(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Update Event Error:", error);
      addNotification({ message: 'Failed to update event', type: 'error' });
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
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
          <Button
            icon={<Plus size={20} />}
            onClick={async () => {
              try {
                const venuesData = await api.getAllVenues();
                setVenues(venuesData);
                setShowCreateModal(true);
              } catch (err) {
                addNotification({ message: 'Failed to load venues', type: 'error' });
              }
            }}
          >
            Create Event
          </Button>
        </div>

        <div className="dashboard-tabs">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            <TrendingUp size={20} /> Overview
          </button>
          <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>
            <Calendar size={20} /> My Events
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

      {/* ================= MODAL ================= */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={() => { resetForm(); setShowCreateModal(false); setShowEditModal(false); setEditingEvent(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
            
            <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="event-form">
              {/* Step 1 */}
              {step === 1 && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Event Title</label>
                      <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
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
                    <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date & Time</label>
                      <input type="datetime-local" value={formData.startDateTime} onChange={e => setFormData({...formData, startDateTime: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>End Date & Time</label>
                      <input type="datetime-local" value={formData.endDateTime} onChange={e => setFormData({...formData, endDateTime: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Venue</label>
                    <select value={formData.venue} onChange={e => handleVenueChange(e.target.value)} required>
                      <option value="">Select Venue</option>
                      {venues.filter(v => v.isAvailable).map(v => <option key={v.venueId} value={v.venueId}>{v.venueName}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                  </div>
                </>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <>
                  <h3>Ticket Details</h3>
                  {tickets.map((ticket, index) => (
                    <div className="form-row" key={ticket.type}>
                      <div className="form-group">
                        <label>{ticket.type} Price</label>
                        <input type="number" value={ticket.price} onChange={e => handleTicketChange(index, 'price', e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>{ticket.type} Quantity</label>
                        <input type="number" value={ticket.quantity} onChange={e => handleTicketChange(index, 'quantity', e.target.value)} required />
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Buttons */}
              <div className="modal-actions">
                <Button type="button" variant="outline" onClick={() => { resetForm(); setShowCreateModal(false); setShowEditModal(false); setEditingEvent(null); }}>
                  Cancel
                </Button>

                {step === 2 && (
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                )}

                {step === 1 ? (
                  <Button type="button" onClick={() => setStep(2)}>Next</Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
