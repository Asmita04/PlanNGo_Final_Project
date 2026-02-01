import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Plus, Edit, Trash2, Eye, X, Loader2 } from 'lucide-react';
import { api } from '../services';
import './VenueManagement.css';

// Add your API keys here
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_KEY';

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [venueForm, setVenueForm] = useState({
    venueName: '',
    capacity: '',
    location: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    contactPhone: '',
    contactEmail: '',
    googleMapsUrl: '',
    description: '',
    isAvailable: true
  });
  const [venueImages, setVenueImages] = useState({});

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
  ];

  const citiesByState = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut'],
    'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak'],
    'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam']
  };

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const venuesData = await api.getAllVenues();
      setVenues(venuesData);
      
      // Generate images for existing venues using Unsplash
      const images = {};
      
      if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'YOUR_UNSPLASH_KEY') {
        for (const venue of venuesData) {
          try {
            const searchQuery = [venue.venueName, venue.city].filter(Boolean).join(' ');
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              images[venue.venueId] = data.results[0].urls.regular;
            } else {
              images[venue.venueId] = `https://picsum.photos/300/300?random=${venue.venueId}`;
            }
          } catch (error) {
            console.error(`Error fetching image for ${venue.venueName}:`, error);
            images[venue.venueId] = `https://picsum.photos/300/300?random=${venue.venueId}`;
          }
        }
      } else {
        venuesData.forEach(venue => {
          images[venue.venueId] = `https://picsum.photos/300/300?random=${venue.venueId}`;
        });
      }
      
      setVenueImages(images);
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVenue = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setVenueForm({
      venueName: '',
      capacity: '',
      location: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      contactPhone: '',
      contactEmail: '',
      googleMapsUrl: '',
      description: '',
      isAvailable: true
    });
    setVenueImages(prev => {
      const newImages = { ...prev };
      delete newImages.new;
      return newImages;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVenueForm(prev => {
      const updated = { ...prev, [name]: value };
      // Reset city when state changes
      if (name === 'state') {
        updated.city = '';
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createVenue(venueForm);
      console.log('Venue added successfully:', venueForm);
      handleCloseModal();
      loadVenues();
    } catch (error) {
      console.error('Error adding venue:', error);
    }
  };

  const generateGoogleMapsUrl = async () => {
    const { address, city, state, country, venueName } = venueForm;
    
    if (!address && !city && !venueName) {
      alert('Please enter at least venue name, address, or city');
      return;
    }

    setImageLoading(true);

    try {
      const searchQuery = [venueName, address, city, state, country]
        .filter(Boolean)
        .join(', ');

      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
      setVenueForm(prev => ({ ...prev, googleMapsUrl }));
      
      // Try Unsplash for venue images
      if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'YOUR_UNSPLASH_KEY') {
        try {
          console.log('Fetching from Unsplash:', searchQuery);
          const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
          const data = await response.json();
          
          console.log('Unsplash response:', data);
          
          if (data.results && data.results.length > 0) {
            console.log('Found Unsplash image:', data.results[0].urls.regular);
            setVenueImages(prev => ({ ...prev, new: data.results[0].urls.regular }));
          } else {
            console.log('No Unsplash results, using placeholder');
            const randomId = Date.now();
            setVenueImages(prev => ({ ...prev, new: `https://picsum.photos/600/400?random=${randomId}` }));
          }
        } catch (error) {
          console.error('Unsplash API error:', error);
          const randomId = Date.now();
          setVenueImages(prev => ({ ...prev, new: `https://picsum.photos/600/400?random=${randomId}` }));
        }
      } else {
        console.log('No Unsplash key, using placeholder');
        const randomId = Date.now();
        setVenueImages(prev => ({ ...prev, new: `https://picsum.photos/600/400?random=${randomId}` }));
      }

    } catch (error) {
      console.error('Error generating Google Maps URL:', error);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="venue-management">
      <div className="section-header">
        <h2>
          <MapPin size={32} />
          Venue Management
        </h2>
        <p>Manage all venues in the system</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-dropdown">
          <Filter size={20} />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Venues</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
        </div>
        <button className="add-btn" onClick={handleAddVenue}>
          <Plus size={20} />
          Add Venue
        </button>
      </div>

      <div className="venues-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px 0' }}>
        {loading ? (
          <div className="loading-state">Loading venues...</div>
        ) : venues.length === 0 ? (
          <div className="empty-state">
            <MapPin size={64} />
            <h3>No venues found</h3>
            <p>Start by adding your first venue</p>
          </div>
        ) : (
          venues.map(venue => (
            <div key={venue.venueId} className="venue-card" style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="venue-image" style={{ height: '180px', overflow: 'hidden' }}>
                <img 
                  src={venueImages[venue.venueId] || 'https://via.placeholder.com/300x180/20B2AA/FFFFFF?text=No+Image'} 
                  alt={venue.venueName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="venue-content" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>{venue.venueName}</h4>
                <p className="venue-location" style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{venue.location}, {venue.city}</p>
                <p className="venue-description" style={{ margin: '0 0 12px 0', color: '#888', fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{venue.description}</p>
                <div className="venue-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="capacity" style={{ fontSize: '14px', fontWeight: '500' }}>Capacity: {venue.capacity}</span>
                  <span className={`status-badge status-${venue.isAvailable ? 'available' : 'booked'}`} style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    backgroundColor: venue.isAvailable ? '#d1fae5' : '#fee2e2',
                    color: venue.isAvailable ? '#065f46' : '#991b1b'
                  }}>
                    {venue.isAvailable ? 'Available' : 'Booked'}
                  </span>
                </div>
                <div className="venue-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button className="action-btn view" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #20B2AA', backgroundColor: 'transparent', color: '#20B2AA', cursor: 'pointer' }}>
                    <Eye size={16} />
                  </button>
                  <button className="action-btn edit" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #20B2AA', backgroundColor: 'transparent', color: '#20B2AA', cursor: 'pointer' }}>
                    <Edit size={16} />
                  </button>
                  <button className="action-btn delete" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Venue Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Venue</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Venue Name</label>
                <input
                  type="text"
                  name="venueName"
                  value={venueForm.venueName}
                  onChange={handleInputChange}
                  placeholder="Enter venue name"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={venueForm.capacity}
                    onChange={handleInputChange}
                    placeholder="Enter capacity"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={venueForm.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={venueForm.address}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  <select
                    name="state"
                    value={venueForm.state}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>City</label>
                  <select
                    name="city"
                    value={venueForm.city}
                    onChange={handleInputChange}
                    required
                    disabled={!venueForm.state}
                  >
                    <option value="">Select City</option>
                    {venueForm.state && citiesByState[venueForm.state] && 
                      citiesByState[venueForm.state].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={venueForm.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                    readOnly
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={venueForm.postalCode}
                    onChange={handleInputChange}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={venueForm.contactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter contact phone"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={venueForm.contactEmail}
                    onChange={handleInputChange}
                    placeholder="Enter contact email"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Google Maps URL & Venue Image</label>
                <div className="url-input-group" style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    name="googleMapsUrl"
                    value={venueForm.googleMapsUrl}
                    onChange={handleInputChange}
                    placeholder="Auto-generated or enter manually"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="generate-url-btn"
                    onClick={generateGoogleMapsUrl}
                    disabled={(!venueForm.address && !venueForm.city && !venueForm.venueName) || imageLoading}
                    style={{ 
                      padding: '8px 16px',
                      backgroundColor: '#20B2AA',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: imageLoading ? 'not-allowed' : 'pointer',
                      opacity: imageLoading ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {imageLoading ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        <span>Fetching...</span>
                      </>
                    ) : (
                      'Fetch Image'
                    )}
                  </button>
                </div>
                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE' 
                    ? '⚠️ Configure REACT_APP_GOOGLE_MAPS_API_KEY in .env for real images'
                    : '✓ API key configured - will fetch real venue photos'}
                </small>
                {venueImages.new && (
                  <div className="image-preview" style={{ marginTop: '12px' }}>
                    <img 
                      src={venueImages.new} 
                      alt="Venue preview" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '200px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '2px solid #20B2AA'
                      }}
                    />
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#666', 
                      marginTop: '8px',
                      textAlign: 'center' 
                    }}>
                      {GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE' 
                        ? 'Placeholder image - add API key for real photos'
                        : 'Venue image from Google Maps'}
                    </p>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={venueForm.description}
                  onChange={handleInputChange}
                  placeholder="Enter venue description"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={venueForm.isAvailable}
                    onChange={(e) => setVenueForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  />
                  <span>Available for booking</span>
                </label>
              </div>
              <div className="modal-footer" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={handleCloseModal}
                  style={{ 
                    padding: '10px 20px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  style={{ 
                    padding: '10px 20px',
                    backgroundColor: '#20B2AA',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Add Venue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VenueManagement;