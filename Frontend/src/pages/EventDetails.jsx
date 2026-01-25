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
      const data = await api.getEventById(id);
      setEvent(data);
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

  const isFavorite = favorites.includes(event.id);
  const availableTickets = event.capacity - event.booked;

  return (
    <div className="event-details-page">
      <div className="event-hero" style={{ backgroundImage: `url(${event.image})` }}>
        <div className="event-hero-overlay">
          <div className="container">
            <div className="event-hero-content">
              <span className="event-badge">{event.category}</span>
              <h1>{event.title}</h1>
              <div className="event-meta">
                <div className="meta-item">
                  <Calendar size={20} />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="meta-item">
                  <Clock size={20} />
                  <span>{event.time}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={20} />
                  <span>{event.location}</span>
                </div>
              </div>
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
                  <h3>{event.venue}</h3>
                  <p>{event.location}</p>
                </div>
              </div>
              <TravelOptions eventLocation={event.location} eventVenue={event.venue} />
            </div>

            <div className="event-section">
              <h2>Event Schedule</h2>
              <div className="schedule-list">
                {event.schedule.map((item, index) => (
                  <div key={index} className="schedule-item">
                    <span className="schedule-time">{item.time}</span>
                    <span className="schedule-activity">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="event-section">
              <h2>Tags</h2>
              <div className="event-tags">
                {event.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="event-sidebar">
            <div className="booking-card">
              <div className="price-section">
                <span className="price-label">Ticket Price</span>
                <span className="price">₹{event.price}</span>
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
                    max={availableTickets}
                  />
                  <button onClick={() => setQuantity(Math.min(availableTickets, quantity + 1))}>+</button>
                </div>
              </div>

              <div className="total-price">
                <span>Total</span>
                <span>₹{event.price * quantity}</span>
              </div>

              <Button fullWidth size="lg" onClick={handleBooking} disabled={availableTickets === 0}>
                {availableTickets === 0 ? 'Sold Out' : 'Book Now'}
              </Button>

              <div className="action-buttons">
                <button className="action-btn" onClick={() => toggleFavorite(event.id)}>
                  <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : 'currentColor'} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button className="action-btn" onClick={handleShare}>
                  <Share2 size={20} />
                  Share
                </button>
              </div>

              <div className="organizer-info">
                <h4>Organized by</h4>
                <p>{event.organizer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
