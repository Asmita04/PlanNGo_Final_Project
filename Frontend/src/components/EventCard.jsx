import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, MapPin, Calendar, Clock } from 'lucide-react';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  if (!event) return null;

  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    const eventId = event.eventId || event.id;
    if (eventId) {
      navigate(`/events/${eventId}`);
    }
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
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer w-full border border-gray-700 hover:border-gray-600 group">
        <div className="relative w-full h-64 overflow-hidden" onClick={handleImageClick}>
          <img 
            src={event.eventImage || '/placeholder.jpg'} 
            alt={event.title || 'Event'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {booked > (capacity * 0.8) && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              🔥 Trending
            </div>
          )}
        </div>
        
        <div className="p-5 bg-gradient-to-b from-slate-800 to-slate-900">
          <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors">
            {event.title || 'Untitled Event'}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-300 text-sm">
              <MapPin size={14} className="mr-2 text-blue-400" />
              <span className="line-clamp-1">
                {event.venue?.venueName
                  ? `${event.venue.venueName}, ${event.venue.city}`
                  : event.location || 'Location TBD'}
              </span>
            </div>
            
            <div className="flex items-center text-gray-300 text-sm">
              <Calendar size={14} className="mr-2 text-blue-400" />
              <span>
                {event.startDate ? new Date(event.startDate).toLocaleDateString() : (event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD')}
              </span>
              {event.time && (
                <>
                  <Clock size={14} className="ml-3 mr-1 text-blue-400" />
                  <span>{event.time}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-gray-200 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 border border-slate-600 hover:border-slate-500"
              onClick={handleShareClick}
              title="Share event"
            >
              <Share2 size={16} /> Share
            </button>
            <button 
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              onClick={handleBookClick}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white border-0 w-10 h-10 rounded-full text-xl cursor-pointer z-10 flex items-center justify-center transition-colors" onClick={closeModal}>
              ×
            </button>
            
            <div className="w-full h-80 overflow-hidden rounded-t-2xl">
              <img 
                src={event.eventImage || '/placeholder.jpg'} 
                alt={event.title || 'Event'}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{event.title || 'Untitled Event'}</h2>
              {event.organizer && <p className="text-gray-600 text-lg mb-6">by {event.organizer}</p>}
              {event.description && <p className="text-gray-700 text-base leading-relaxed mb-8">{event.description}</p>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {(event.startDate || event.date) && (
                  <div className="flex items-center">
                    <Calendar size={20} className="mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Date</p>
                      <p className="text-gray-600">{new Date(event.startDate || event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                
                {event.time && (
                  <div className="flex items-center">
                    <Clock size={20} className="mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Time</p>
                      <p className="text-gray-600">{event.time}</p>
                    </div>
                  </div>
                )}
                
                {(event.venueName || event.venue || event.location) && (
                  <div className="flex items-center">
                    <MapPin size={20} className="mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{event.venueName || event.venue || event.location}</p>
                    </div>
                  </div>
                )}
                
                {(event.ticketPrice || event.price) && (
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">₹</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Price</p>
                      <p className="text-gray-600">₹{event.ticketPrice || event.price}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <button 
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300"
                  onClick={handleShareClick}
                >
                  <Share2 size={18} /> Share Event
                </button>
                <button 
                  className="flex-1 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() => {
                    const eventId = event.eventId || event.id;
                    if (eventId) {
                      setShowModal(false);
                      navigate(`/events/${eventId}`);
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