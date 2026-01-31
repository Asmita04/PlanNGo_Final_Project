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
    country: '',
    postalCode: '',
    contactPhone: '',
    contactEmail: '',
    googleMapsUrl: '',
    description: '',
    isAvailable: true
  });

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
      country: '',
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
    setVenueForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add venue logic here
    console.log('Adding venue:', venueForm);
    handleCloseModal();
  };

  const generateGoogleMapsUrl = () => {
    const { address, city, state, country } = venueForm;
    if (address || city) {
      const fullAddress = [address, city, state, country].filter(Boolean).join(', ');
      const encodedAddress = encodeURIComponent(fullAddress);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      setVenueForm(prev => ({ ...prev, googleMapsUrl }));
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
        <div className="table-header">
          <div>Venue Name</div>
          <div>Location</div>
          <div>Capacity</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
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
            <div key={venue.venueId} className="table-row">
              <div className="venue-info">
                <h4>{venue.venueName}</h4>
                <p>{venue.description}</p>
              </div>
              <div>{venue.location}, {venue.city}</div>
              <div>{venue.capacity}</div>
              <div>
                <span className={`status-badge status-${venue.isAvailable ? 'available' : 'booked'}`}>
                  {venue.isAvailable ? 'Available' : 'Booked'}
                </span>
              </div>
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
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={venueForm.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={venueForm.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    required
                  />
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
                    required
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
                <div className="url-input-group">
                  <input
                    type="url"
                    name="googleMapsUrl"
                    value={venueForm.googleMapsUrl}
                    onChange={handleInputChange}
                    placeholder="Enter Google Maps URL or generate from address"
                  />
                  <button
                    type="button"
                    className="generate-url-btn"
                    onClick={generateGoogleMapsUrl}
                    disabled={!venueForm.address && !venueForm.city}
                  >
                    Generate URL
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
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={venueForm.isAvailable}
                    onChange={(e) => setVenueForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  />
                  Available for booking
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
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