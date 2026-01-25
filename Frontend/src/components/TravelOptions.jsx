import { useState, useEffect } from 'react';
import { Navigation, MapPin, Clock, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { mapsService } from '../services/maps';
import Button from './Button';
import './TravelOptions.css';

const TravelOptions = ({ eventLocation, eventVenue }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [travelOptions, setTravelOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [expandedTransit, setExpandedTransit] = useState(false);

  const loadTravelOptions = async () => {
    setLoading(true);
    setError(null);

    try {
      const userPos = await mapsService.getUserLocation();
      setUserLocation(userPos);

      const eventPos = await mapsService.geocodeAddress(`${eventVenue}, ${eventLocation}`);
      const options = await mapsService.getTravelOptions(userPos, eventPos, eventLocation);
      setTravelOptions(options);
      setShowOptions(true);
    } catch (err) {
      console.error('Travel options error:', err);
      setError(err.message || 'Unable to get directions');
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    if (userLocation) {
      mapsService.geocodeAddress(`${eventVenue}, ${eventLocation}`).then(eventPos => {
        const url = mapsService.getMapUrl(userLocation, eventPos);
        window.open(url, '_blank');
      });
    }
  };

  return (
    <div className="travel-options">
      <div className="travel-header">
        <h3>
          <Navigation size={20} />
          How to Get There
        </h3>
        {!showOptions && (
          <Button 
            size="sm" 
            onClick={loadTravelOptions} 
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Directions'}
          </Button>
        )}
      </div>

      {error && (
        <div className="travel-error">
          <p>{error}</p>
          {error.includes('denied') && (
            <small>Go to browser settings → Site settings → Location → Allow</small>
          )}
          {error.includes('timeout') && (
            <small>Check if location services are enabled on your device</small>
          )}
          {!error.includes('denied') && !error.includes('timeout') && (
            <small>You can still open directions in Google Maps</small>
          )}
        </div>
      )}

      {loading && (
        <div className="travel-loading">
          <Loader className="spinner" size={32} />
          <p>Finding best routes...</p>
        </div>
      )}

      {showOptions && travelOptions.length > 0 && (
        <div className="travel-options-list">
          {travelOptions.map((option, index) => (
            <div key={index} className="travel-option-card">
              <div 
                className="option-header" 
                onClick={() => option.mode === 'TRANSIT' && setExpandedTransit(!expandedTransit)}
                style={{ cursor: option.mode === 'TRANSIT' ? 'pointer' : 'default' }}
              >
                <span className="option-icon">{option.icon}</span>
                <div className="option-info">
                  <h4>
                    {option.mode.charAt(0) + option.mode.slice(1).toLowerCase()}
                    {option.mode === 'TRANSIT' && (
                      expandedTransit ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </h4>
                  <div className="option-details">
                    <span>
                      <Clock size={14} />
                      {option.duration}
                    </span>
                    <span>
                      <MapPin size={14} />
                      {option.distance}
                    </span>
                  </div>
                </div>
              </div>
              {option.mode === 'TRANSIT' && expandedTransit && option.transitOptions && (
                <div className="transit-dropdown">
                  {option.transitOptions.map((transit, idx) => (
                    <div key={idx} className="transit-option">
                      <span className="transit-icon">{transit.icon}</span>
                      <div className="transit-info">
                        <strong>{transit.name}</strong>
                        <small>{transit.route}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Button 
            variant="outline" 
            fullWidth 
            onClick={openInGoogleMaps}
            icon={<Navigation size={16} />}
          >
            Open in Google Maps
          </Button>
        </div>
      )}
    </div>
  );
};

export default TravelOptions;
