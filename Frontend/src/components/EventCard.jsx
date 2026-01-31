import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!event) return null;

  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    const eventId = event.eventId || event.id;
    console.log('Event object:', event);
    console.log('Event ID:', eventId);
    if (eventId) {
      navigate(`/events/${eventId}`);
    } else {
      console.error('No event ID found');
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const booked = event.booked || 0;
  const capacity = event.availableTickets || event.capacity || 0;

  return (
    <>
      <div className="event-card">
        <div className="event-image" onClick={handleImageClick}>
          <img 
            src={event.eventImage || event.image || '/placeholder.jpg'} 
            alt={event.title || 'Event'}
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
          {booked > (capacity * 0.8) && <div className="event-badge">Popular</div>}
          <button 
            className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="favorite-icon">
              {isFavorited ? '♥' : '♡'}
            </span>
          </button>
        </div>
        <div className="event-info">
          <h3 className="event-title">{event.title || 'Untitled Event'}</h3>
          <p className="event-location">
            {event.venue?.venueName
              ? `${event.venue.venueName}, ${event.venue.city}`
              : event.location || 'Location TBD'}
          </p>
          <p className="event-datetime">
            {event.startDate ? new Date(event.startDate).toLocaleDateString() : (event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD')}
            {event.time && ` • ${event.time}`}
          </p>
          <div className="event-actions">
            <button 
              className="share-button"
              onClick={handleShareClick}
              title="Share event"
            >
              📤 Share
            </button>
            <button 
              className="book-button"
              onClick={handleBookClick}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-image">
              <img 
                src={event.eventImage || event.image || '/placeholder.jpg'} 
                alt={event.title || 'Event'}
              />
            </div>
            <div className="modal-details">
              <h2>{event.title || 'Untitled Event'}</h2>
              {event.organizer && <p className="modal-organizer">by {event.organizer}</p>}
              {event.description && <p className="modal-description">{event.description}</p>}
              <div className="modal-info">
                {(event.startDate || event.date) && <p><strong>Date:</strong> {new Date(event.startDate || event.date).toLocaleDateString()}</p>}
                {event.time && <p><strong>Time:</strong> {event.time}</p>}
                {(event.venueName || event.venue || event.location) && (
                  <p><strong>Location:</strong> {event.venueName || event.venue || event.location}</p>
                )}
                {(event.ticketPrice || event.price) && <p><strong>Price:</strong> ₹{event.ticketPrice || event.price}</p>}
                {capacity > 0 && (
                  <p><strong>Availability:</strong> {capacity} tickets available</p>
                )}
              </div>
              <div className="modal-actions">
                <button 
                  className={`modal-like-btn ${isFavorited ? 'favorited' : ''}`}
                  onClick={handleFavoriteClick}
                >
                  <span>{isFavorited ? '♥' : '♡'}</span>
                  {isFavorited ? 'Liked' : 'Like'}
                </button>
                <button 
                  className="modal-share-btn"
                  onClick={handleShareClick}
                >
                  <span>📤</span>
                  Share
                </button>
                <button 
                  className="modal-book-btn"
                  onClick={() => {
                    const eventId = event.eventId || event.id;
                    if (eventId) {
                      setShowModal(false);
                      navigate(`/events/${eventId}`);
                    } else {
                      console.error('No event ID found');
                    }
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;