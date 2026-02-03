import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { Plus, Calendar, Users, DollarSign, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../components/Button';

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
    category: 'MUSIC',
    startDateTime: '',
    endDateTime: '',
    venue: '',
    imageFile: null,
    imagePreview: ''
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

  const getSelectedVenue = () => {
    return venues.find(v => v.venueId.toString() === formData.venue);
  };

  const getTotalTicketQuantity = () => {
    return tickets.reduce((total, ticket) => total + (parseInt(ticket.quantity) || 0), 0);
  };

  const getRemainingCapacity = () => {
    const selectedVenue = getSelectedVenue();
    if (!selectedVenue) return 0;
    return selectedVenue.capacity - getTotalTicketQuantity();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'MUSIC',
      startDateTime: '',
      endDateTime: '',
      venue: '',
      imageFile: null,
      imagePreview: ''
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
      const formDataToSend = new FormData();
      
      // Add event data as JSON blob
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category.toUpperCase(),
        startDate: new Date(formData.startDateTime).toISOString(),
        endDate: new Date(formData.endDateTime).toISOString(),
        venueId: Number(formData.venue),
        tickets: tickets.map(t => ({
          ticketType: t.type,
          price: Number(t.price),
          totalQuantity: Number(t.quantity)
        }))
      };
      
      formDataToSend.append('eventRequest', new Blob([JSON.stringify(eventData)], { type: 'application/json' }));
      
      // Add image file if selected
      if (formData.imageFile) {
        formDataToSend.append('eventImage', formData.imageFile);
      }

      const userId = user.id || 1;
      await api.createEventWithUserId(userId, formDataToSend);
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
      imageFile: null,
      imagePreview: event.eventImage || ''
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Organizer Dashboard</h1>
              <p className="text-white/80 text-lg">Manage your events and track performance</p>
            </div>
            <button
              className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-2 shadow-lg"
              onClick={async () => {
                try {
                  setShowCreateModal(true);
                  const venuesData = await api.getAllVenues();
                  setVenues(venuesData);
                } catch (err) {
                  addNotification({ message: 'Failed to load venues', type: 'error' });
                }
              }}
            >
              <Plus size={20} />
              Create Event
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'overview' 
                ? 'bg-white text-gray-900 shadow-lg' 
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={20} /> Overview
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'events' 
                ? 'bg-white text-gray-900 shadow-lg' 
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
            }`}
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={20} /> My Events
          </button>
        </div>

        <div className="space-y-8">
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
                        <option value="MUSIC">Music</option>
                        <option value="COMEDY">Comedy</option>
                        <option value="ART">Art</option>
                        <option value="DRAMA">Drama</option>
                        <option value="DANCE">Dance</option>
                        <option value="THEATRE">Theatre</option>
                        <option value="MOVIE">Movie</option>
                        <option value="STANDUP">Stand-up</option>
                        <option value="OPEN_MIC">Open Mic</option>
                        <option value="FESTIVAL">Festival</option>
                        <option value="SPORTS">Sports</option>
                        <option value="TECH">Tech</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="CONFERENCE">Conference</option>
                        <option value="SEMINAR">Seminar</option>
                        <option value="EXHIBITION">Exhibition</option>
                        <option value="CULTURAL">Cultural</option>
                        <option value="RELIGIOUS">Religious</option>
                        <option value="SOCIAL">Social</option>
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
                    <select 
                      value={formData.venue} 
                      onChange={e => handleVenueChange(e.target.value)} 
                      required
                      disabled={venues.filter(v => v.isAvailable).length === 0}
                    >
                      <option value="">
                        {venues.filter(v => v.isAvailable).length === 0 ? 'No venues available' : 'Select Venue'}
                      </option>
                      {venues.filter(v => v.isAvailable).map(v => <option key={v.venueId} value={v.venueId}>{v.venueName}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Event Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData({...formData, imageFile: file, imagePreview: event.target.result});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {formData.imagePreview && (
                      <div className="image-preview">
                        <img src={formData.imagePreview} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px'}} />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <>
                  <div className="venue-capacity-info">
                    <h3>Venue Capacity: {getSelectedVenue()?.capacity || 0}</h3>
                    <p>Total Allocated: {getTotalTicketQuantity()}</p>
                    <p>Remaining: {getRemainingCapacity()}</p>
                  </div>
                  <h3>Ticket Details</h3>
                  {tickets.map((ticket, index) => (
                    <div className="form-row" key={ticket.type}>
                      <div className="form-group">
                        <label>{ticket.type} Price</label>
                        <input type="number" value={ticket.price} onChange={e => handleTicketChange(index, 'price', e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>{ticket.type} Quantity</label>
                        <input 
                          type="number" 
                          value={ticket.quantity} 
                          onChange={e => {
                            const newQuantity = parseInt(e.target.value) || 0;
                            const otherTicketsTotal = tickets.reduce((total, t, i) => 
                              i !== index ? total + (parseInt(t.quantity) || 0) : total, 0
                            );
                            const maxAllowed = (getSelectedVenue()?.capacity || 0) - otherTicketsTotal;
                            if (newQuantity <= maxAllowed) {
                              handleTicketChange(index, 'quantity', e.target.value);
                            }
                          }}
                          max={(getSelectedVenue()?.capacity || 0) - tickets.reduce((total, t, i) => 
                            i !== index ? total + (parseInt(t.quantity) || 0) : total, 0
                          )}
                          required 
                        />
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
