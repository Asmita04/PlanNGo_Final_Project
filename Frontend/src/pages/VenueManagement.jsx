import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { api } from '../services';
import './VenueManagement.css';

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
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

      <div className="venues-table">
        {loading ? (
          <div className="loading-state">Loading venues...</div>
        ) : venues.length === 0 ? (
          <div className="empty-state">
            <MapPin size={64} />
            <h3>No venues found</h3>
            <p>Start by adding your first venue</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <span>Venue</span>
              <span>Location</span>
              <span>Capacity</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {venues.map(venue => (
              <div key={venue.venueId} className="table-row">
                <span>{venue.venueName}</span>
                <span>{venue.city}, {venue.state}</span>
                <span>{venue.capacity}</span>
                <span className={`status-badge status-${venue.isAvailable ? 'available' : 'booked'}`}>
                  {venue.isAvailable ? 'Available' : 'Booked'}
                </span>
                <div className="actions">
                  <button className="action-btn view">
                    <Eye size={16} />
                  </button>
                  <button className="action-btn edit">
                    <Edit size={16} />
                  </button>
                  <button className="action-btn delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </>
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
                <label>Google Maps URL</label>
                <input
                  type="url"
                  name="googleMapsUrl"
                  value={venueForm.googleMapsUrl}
                  onChange={handleInputChange}
                  placeholder="Enter Google Maps URL manually"
                />
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
    </div>
  );
};

export default VenueManagement;