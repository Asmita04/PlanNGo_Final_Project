import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Users, Calendar, ExternalLink } from 'lucide-react';
import { api } from '../services';
import './VenueManagement.css';

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    venueName: '',
    location: '',
    capacity: '',
    isAvailable: true,
    city: '',
    locationURL: '',
  });

  useEffect(() => {
    fetchVenues();
     console.log('Fetched venues:', fetchVenues());
  }, []);


  const fetchVenues = async () => {
    try {
      setLoading(true);
      const data = await api.getAllVenues();
      console.log('Fetched venues:', data);
      setVenues(data);
      setError('');
    } catch (error) {
      console.error('Error fetching venues:', error);
      setError('Failed to load venues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      const venueData = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };
      
      if (editingVenue) {
        await api.updateVenue(editingVenue.venueId, venueData);
        setSuccess('Venue updated successfully!');
      } else {
        await api.createVenue(venueData);
        setSuccess('Venue created successfully!');
      }
      
      fetchVenues();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving venue:', error);
      setError(error.response?.data?.message || 'Failed to save venue. Please try again.');
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      venueName: venue.venueName,
      location: venue.location,
      capacity: venue.capacity.toString(),
      isAvailable: venue.isAvailable,
      googleMapsUrl: venue.googleMapsUrl || '',
      address: venue.address || '',
      city: venue.city || '',
      state: venue.state || '',
      country: venue.country || 'India',
      postalCode: venue.postalCode || '',
      contactPhone: venue.contactPhone || '',
      contactEmail: venue.contactEmail || '',
      description: venue.description || '',
      amenities: venue.amenities || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (venueId) => {
    if (window.confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      try {
        await api.deleteVenue(venueId);
        setSuccess('Venue deleted successfully!');
        fetchVenues();
      } catch (error) {
        console.error('Error deleting venue:', error);
        setError(error.response?.data?.message || 'Failed to delete venue. It may be in use by events.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      venueName: '',
      location: '',
      capacity: '',
      isAvailable: true,
      googleMapsUrl: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      contactPhone: '',
      contactEmail: '',
      description: '',
      amenities: ''
    });
    setEditingVenue(null);
    setError('');
    setSuccess('');
  };

  const generateGoogleMapsUrl = () => {
    if (!formData.address || !formData.city) {
      setError('Please enter address and city first');
      return;
    }
    
    const address = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country}`;
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    setFormData({ ...formData, googleMapsUrl: mapsUrl });
    setSuccess('Google Maps URL generated successfully!');
  };

  if (loading) {
    return (
      <div className="venue-management">
        <div className="loading-spinner">Loading venues...</div>
      </div>
    );
  }

  return (
    <div className="venue-management">
      {/* Success/Error Messages */}
      {success && (
        <div className="alert alert-success">
          {success}
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="venue-header">
        <h1>Venue Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Add New Venue
        </button>
      </div>

      {(venues || []).length === 0 ? (
        <div className="empty-state">
          <MapPin size={48} />
          <h3>No venues found</h3>
          <p>Start by adding your first venue to the platform.</p>
          <button 
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Add First Venue
          </button>
        </div>
      ) : (
        <div className="venues-grid">
          {(venues || []).map(venue => (
            <div key={venue.venueId} className="venue-card">
              <div className="venue-card-header">
                <h3>{venue.venueName}</h3>
                <div className="venue-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(venue)}
                    title="Edit venue"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(venue.venueId)}
                    title="Delete venue"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="venue-info">
                <div className="info-item">
                  <MapPin size={16} />
                  <span>{venue.location}</span>
                </div>
                <div className="info-item">
                  <Users size={16} />
                  <span>Capacity: {venue.capacity.toLocaleString()}</span>
                </div>
                {venue.contactPhone && (
                  <div className="info-item">
                    <Phone size={16} />
                    <span>{venue.contactPhone}</span>
                  </div>
                )}
                {venue.contactEmail && (
                  <div className="info-item">
                    <Mail size={16} />
                    <span>{venue.contactEmail}</span>
                  </div>
                )}
                {venue.address && (
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{venue.address}</span>
                  </div>
                )}
              </div>

              {venue.description && (
                <p className="venue-description">{venue.description}</p>
              )}

              {venue.amenities && (
                <div className="venue-amenities">
                  <strong>Amenities:</strong> {venue.amenities}
                </div>
              )}

              <div className="venue-footer">
                <span className={`status ${venue.isAvailable ? 'available' : 'unavailable'}`}>
                  {venue.isAvailable ? 'Available' : 'Unavailable'}
                </span>
                {venue.googleMapsUrl && (
                  <a 
                    href={venue.googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="maps-link"
                  >
                    <ExternalLink size={16} />
                    View on Maps
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="venue-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Venue Name *</label>
                  <input
                    type="text"
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacity *</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Google Maps URL</label>
                <div className="maps-input-group">
                  <input
                    type="url"
                    value={formData.googleMapsUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                    placeholder="https://www.google.com/maps/..."
                  />
                  <button 
                    type="button" 
                    className="btn-generate-maps"
                    onClick={generateGoogleMapsUrl}
                    disabled={!formData.address || !formData.city}
                  >
                    Generate
                  </button>
                </div>
                <small>Enter address details above and click Generate, or paste a Google Maps URL</small>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Brief description of the venue"
                />
              </div>



              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  />
                  Available for booking
                </label>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit
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