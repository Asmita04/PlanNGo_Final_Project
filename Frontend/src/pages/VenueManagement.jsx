import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Plus, Edit, Trash2, Eye, X, Link as LinkIcon } from 'lucide-react';
import { api } from '../services';
import './VenueManagement.css';

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Create/Edit Modal States
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  // View Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewVenueData, setViewVenueData] = useState(null);

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
    setIsEditing(false);
    setSelectedVenueId(null);
    setShowModal(true);
  };

  const handleEditVenue = (venue) => {
    setVenueForm({
      venueName: venue.venueName || '',
      capacity: venue.capacity || '',
      location: venue.location || '',
      address: venue.address || '',
      city: venue.city || '',
      state: venue.state || '',
      country: venue.country || 'India',
      postalCode: venue.postalCode || '',
      contactPhone: venue.contactPhone || '',
      contactEmail: venue.contactEmail || '',
      googleMapsUrl: venue.googleMapsUrl || '',
      description: venue.description || '',
      isAvailable: venue.isAvailable !== undefined ? venue.isAvailable : true
    });
    setSelectedVenueId(venue.venueId);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewVenue = async (venueId) => {
    try {
      const data = await api.getVenueById(venueId);
      setViewVenueData(data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching venue details:', error);
      alert('Failed to fetch venue details. Please try again.');
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (window.confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      try {
        await api.deleteVenue(venueId);
        loadVenues(); // Refresh list on success
      } catch (error) {
        console.error('Error deleting venue:', error);
        alert('Failed to delete venue. It may be linked to existing events/bookings.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedVenueId(null);
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

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewVenueData(null);
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

  const generateMapsUrl = () => {
    const { venueName, address, city, state, country } = venueForm;

    // Construct search query from available fields
    const parts = [venueName, address, city, state, country].filter(p => p && p.trim() !== '');

    if (parts.length === 0 || (parts.length === 1 && parts[0] === 'India')) {
      alert("Please enter Venue Name, Address, or City to generate a map URL.");
      return;
    }

    const query = encodeURIComponent(parts.join(', '));
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;

    setVenueForm(prev => ({
      ...prev,
      googleMapsUrl: url
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && selectedVenueId) {
        await api.updateVenue(selectedVenueId, venueForm);
        console.log('Venue updated successfully:', venueForm);
      } else {
        await api.createVenue(venueForm);
        console.log('Venue added successfully:', venueForm);
      }
      handleCloseModal();
      loadVenues();
    } catch (error) {
      console.error('Error saving venue:', error);
    }
  };

  // Filter venues
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.venueName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.city?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'available') return matchesSearch && venue.isAvailable;
    if (filterType === 'booked') return matchesSearch && !venue.isAvailable;
    return matchesSearch;
  });

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
        ) : filteredVenues.length === 0 ? (
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
            {filteredVenues.map(venue => (
              <div key={venue.venueId} className="table-row">
                <span>{venue.venueName}</span>
                <span>{venue.city}, {venue.state}</span>
                <span>{venue.capacity}</span>
                <span className={`status-badge status-${venue.isAvailable ? 'available' : 'booked'}`}>
                  {venue.isAvailable ? 'Available' : 'Booked'}
                </span>
                <div className="actions">
                  <button className="action-btn view" onClick={() => handleViewVenue(venue.venueId)}>
                    <Eye size={16} />
                  </button>
                  <button className="action-btn edit" onClick={() => handleEditVenue(venue)}>
                    <Edit size={16} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteVenue(venue.venueId)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* View Venue Modal */}
      {showViewModal && viewVenueData && (
        <div className="modal-overlay" onClick={handleCloseViewModal}>
          <div className="modal-content glass-effect" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Venue Details</h3>
              <button className="close-btn" onClick={handleCloseViewModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="venue-view-details">
                <div className="view-row">
                  <div className="view-group">
                    <label>Venue Name</label>
                    <p>{viewVenueData.venueName}</p>
                  </div>
                  <div className="view-group status">
                    <label>Status</label>
                    <span className={`status-badge status-${viewVenueData.isAvailable ? 'available' : 'booked'}`}>
                      {viewVenueData.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </div>
                </div>

                <div className="view-row">
                  <div className="view-group">
                    <label>Capacity</label>
                    <p>{viewVenueData.capacity}</p>
                  </div>
                  <div className="view-group">
                    <label>Location</label>
                    <p>{viewVenueData.location}</p>
                  </div>
                </div>

                <div className="view-group">
                  <label>Full Address</label>
                  <p>{viewVenueData.address}, {viewVenueData.city}, {viewVenueData.state} - {viewVenueData.postalCode}</p>
                </div>

                <div className="view-row">
                  <div className="view-group">
                    <label>Contact Phone</label>
                    <p>{viewVenueData.contactPhone || 'N/A'}</p>
                  </div>
                  <div className="view-group">
                    <label>Contact Email</label>
                    <p>{viewVenueData.contactEmail || 'N/A'}</p>
                  </div>
                </div>

                {viewVenueData.googleMapsUrl && (
                  <div className="view-group">
                    <label>Google Maps</label>
                    <a href={viewVenueData.googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8' }}>
                      View on Map
                    </a>
                  </div>
                )}

                <div className="view-group">
                  <label>Description</label>
                  <p style={{ lineHeight: '1.6', color: '#cbd5e1' }}>{viewVenueData.description || 'No description available.'}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseViewModal}>Close</button>
              <button className="submit-btn" onClick={() => {
                handleCloseViewModal();
                handleEditVenue(viewVenueData);
              }}>
                Edit Venue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content glass-effect" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Venue' : 'Add New Venue'}</h3>
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
                    className="read-only-input"
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    name="googleMapsUrl"
                    value={venueForm.googleMapsUrl}
                    onChange={handleInputChange}
                    placeholder="Enter Google Maps URL - or generate from address"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={generateMapsUrl}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0 1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}
                    title="Generate URL from address details"
                  >
                    <LinkIcon size={16} />
                    Generate
                  </button>
                </div>
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                >
                  {isEditing ? 'Update Venue' : 'Add Venue'}
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