import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, DollarSign, Users, Heart, Share2, Loader } from 'lucide-react';
import { api } from '../services';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import TravelOptions from '../components/TravelOptions';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, favorites, toggleFavorite, addNotification, bookingState, updateBooking } = useApp();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadEvent();
  }, [id]);

  useEffect(() => {
    // Restore quantity if returning to same event
    if (event && bookingState.event && bookingState.event.id === event.id) {
      setQuantity(bookingState.quantity);
    } else {
      setQuantity(1);
    }
  }, [event, bookingState]);

  const loadEvent = async () => {
    try {
      // If id is a number, use it as eventId, otherwise treat as title
      const isNumericId = !isNaN(id);
      let eventData;
      
      if (isNumericId) {
        eventData = await api.getEventById(id);
      } else {
        // Get all events and find by title
        const allEvents = await api.getAllEvents();
        const decodedTitle = decodeURIComponent(id);
        eventData = allEvents.find(event => event.title === decodedTitle);
        if (!eventData) {
          throw new Error('Event not found');
        }
      }
      
      setEvent(eventData);
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    console.log('Updating booking with:', { event, quantity });
    updateBooking(event, quantity);
    
    // Small delay to ensure state is updated
    setTimeout(() => {
      navigate('/review');
    }, 100);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification({ message: 'Link copied to clipboard!', type: 'success' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="spinner" size={48} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="error-container">
        <h2>Event not found</h2>
        <Button onClick={() => navigate('/events')}>Back to Events</Button>
      </div>
    );
  }

  const eventId = event.eventId ?? event.id;
  const isFavorite = favorites.includes(eventId);

  const availableTickets = event.capacity - event.booked;

  return (
    <div className="event-details-page">
      <div className="relative w-full h-96 bg-cover bg-center" style={{ backgroundImage: `url(${event.eventImage || '/placeholder.jpg'})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{event.title}</h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-blue-400" />
                <span className="text-lg font-medium">
                  {event.startDate || event.date ? 
                    new Date(event.startDate || event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Date TBD'
                  }
                </span>
              </div>
              {event.time && (
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-blue-400" />
                  <span className="text-lg font-medium">{event.time}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-blue-400" />
                <span className="text-lg font-medium">
                  {event.venue?.venueName && event.venue?.city ? 
                    `${event.venue.venueName}, ${event.venue.city}` : 
                    event.location || 'Location TBD'
                  }
                </span>
              </div>
            </div>
            <div className="mt-6">
              <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {event.category || 'Event'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="event-content">
          <div className="event-main">
            <div className="event-section">
              <h2>About This Event</h2>
              <p>{event.description}</p>
            </div>

            <div className="event-section">
              <h2>Venue</h2>
              <div className="venue-info">
                <MapPin size={24} />
                <div>
                 <h3>{event.venue?.venueName}</h3>
                 <p>{event.venue?.address}</p>

                </div>
              </div>
            <TravelOptions eventLocation={event.venue?.city} eventVenue={event.venue?.venueName}/>
            </div>

            <div className="event-section">
              <h2>Event Schedule</h2>
              <div className="schedule-list">
               {event.schedule?.length ? (
                  event.schedule.map((item, index) => (
                    <div key={index} className="schedule-item">
                      <span className="schedule-time">{item.time}</span>
                      <span className="schedule-activity">{item.activity}</span>
                    </div>
                  ))
                ) : (
                <p>No schedule available</p>
              )}

              </div>
            </div>

            <div className="event-section">
              <h2>Tags</h2>
              <div className="event-tags">
               {event.tags?.length ? (
                  event.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))
                ) : (
                  <span className="tag">General</span>
                )}

              </div>
            </div>
          </div>

          <div className="event-sidebar">
            <div className="booking-card">
              <div className="price-section">
                <span className="price-label">Ticket Price</span>
                <span className="price">₹{event.ticketPrice || event.price || 0}</span>
              </div>

              <div className="availability">
                <Users size={20} />
                <span>{availableTickets} tickets available</span>
              </div>

              <div className="quantity-selector">
                <label>Number of Tickets</label>
                <div className="quantity-controls">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(availableTickets, value)));
                    }}
                    min="1"
                    max={Math.max(1, availableTickets)}
                  />
                  <button onClick={() => setQuantity(Math.min(availableTickets, quantity + 1))}>+</button>
                </div>
              </div>

              <div className="total-price">
                <span>Total</span>
                <span>₹{(event.ticketPrice || event.price || 0) * quantity}</span>
              </div>

              <Button fullWidth size="lg" onClick={handleBooking} disabled={availableTickets === 0}>
                {availableTickets === 0 ? 'Sold Out' : 'Book Now'}
              </Button>

              <div className="action-buttons">
                <button className="action-btn" onClick={() => toggleFavorite(eventId)}>
                  <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : 'currentColor'} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button className="action-btn" onClick={handleShare}>
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
