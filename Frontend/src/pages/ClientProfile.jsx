import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api, apiClient } from '../services';
import { User, Mail, Phone, Calendar, Edit2, Save, X, Award, Ticket, Heart, MapPin, Camera, Plus, ExternalLink } from 'lucide-react';
import './ClientProfile.css';

const ClientProfile = () => {
  const { user, updateUser, addNotification } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationForm, setLocationForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const indianStates = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Udaipur'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi'],
    'Delhi': ['New Delhi', 'Delhi Cantonment', 'Karol Bagh', 'Lajpat Nagar'],
    'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam']
  };
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    locationText: '',
    bio: ''
  });

  // Get user data from localStorage or context
  const getUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      return parsed;
    }
    return user;
  };

  const userData = getUserData();
  const { firstName = '', lastName = '' } = userData || {};

  // Function to display user-friendly role name
  const getRoleDisplayName = (role) => {
    if (role === 'ROLE_CUSTOMER') return 'User';
    if (role === 'ROLE_ORGANIZER') return 'Organizer';
    if (role === 'ROLE_ADMIN') return 'Admin';
    return role;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : user;
    
    if (userData && !isEditing) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || user?.email || '',
        phoneNumber: userData.phone || user?.phoneNumber || '',
        dateOfBirth: userData.dob || user?.dateOfBirth || '',
        gender: userData.gender || user?.gender || '',
        address: userData.address || user?.address || '',
        locationText: userData.locationText || user?.locationText || '',
        bio: userData.bio || user?.bio || ''
      });
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const savePhotoLocally = (file, userId) => {
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem(`profilePhoto_${userId}`, reader.result);
    };
    reader.readAsDataURL(file);
    return `cdn/user_pfp/${userId}.jpg`;
  };

  const handleAddLocation = () => {
    const fullAddress = `${locationForm.street}, ${locationForm.city}, ${locationForm.state} ${locationForm.zipCode}, ${locationForm.country}`;
    const locationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    
    setFormData({
      ...formData,
      address: fullAddress,
      locationText: fullAddress
    });
    
    setShowLocationModal(false);
    setLocationForm({ street: '', city: '', state: '', zipCode: '', country: 'India' });
  };

  const getLocationText = () => {
    if (formData.locationText) return formData.locationText;
    if (formData.address && formData.address.includes('google.com/maps')) {
      const urlParams = new URLSearchParams(formData.address.split('?')[1]);
      return decodeURIComponent(urlParams.get('query') || 'View Location');
    }
    return formData.address || 'View Location';
  };

  // NEW: always produce a clickable map/search link for the address
  const getAddressLink = () => {
    const raw = formData.address || userData?.address || formData.locationText || userData?.locationText;
    if (!raw) return '';
    if (typeof raw === 'string' && (raw.startsWith('http://') || raw.startsWith('https://'))) return raw;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`;
  };
  
  const handleSave = async () => {
    setLoading(true);
    try {
      const userId = userData?.id || user?.id;
      
      // ensure address sent to backend is a clickable link (Google Maps search link)
      let addressToSend = formData.address;
      if (!addressToSend || !(addressToSend.startsWith('http://') || addressToSend.startsWith('https://'))) {
        const textForLink = formData.locationText || userData?.locationText || formData.address || userData?.address || '';
        addressToSend = textForLink ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(textForLink)}` : '';
      }

      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        dob: formData.dateOfBirth,
        gender: (formData.gender || '').toUpperCase(),
        address: addressToSend,
        bio: formData.bio
      };
      
      // Log the exact payload sent to backend
      console.log('Profile data to send:', profileData);
      
      const response = await apiClient.put(`/customer/profile/${userId}`, profileData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Update localStorage with new data (store address as link)
      const updatedUser = {
        ...userData,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        dob: formData.dateOfBirth,
        gender: formData.gender,
        address: addressToSend,
        bio: formData.bio
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      updateUser(response.user || updatedUser);
      addNotification({ message: 'Profile updated successfully! 🎉', type: 'success' });
      setIsEditing(false);
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
    } catch (error) {
      console.error('Profile update error:', error);
      addNotification({ 
        message: error.response?.data?.message || error.message || 'Failed to update profile', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || user?.email || '',
      phoneNumber: userData?.phone || user?.phoneNumber || '',
      dateOfBirth: userData?.dob || user?.dateOfBirth || '',
      gender: userData?.gender || user?.gender || '',
      address: userData?.address || user?.address || '',
      locationText: userData?.locationText || user?.locationText || '',
      bio: userData?.bio || user?.bio || ''
    });
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsEditing(false);
  };

  const getProfilePhotoSrc = () => {
    const userId = userData?.id || user?.id;
    if (profilePhotoPreview) return profilePhotoPreview;
    
    const savedPhoto = localStorage.getItem(`profilePhoto_${userId}`);
    if (savedPhoto) return savedPhoto;
    
    if (userData?.pfp) return userData.pfp;
    
    return 'cdn/user_pfp/NotFound.jpg';
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header Card */}
        <div className="profile-header">
          <div className="header-content">
            <div className="profile-avatar" onClick={() => isEditing && fileInputRef.current?.click()}>
              {profilePhotoPreview || localStorage.getItem(`profilePhoto_${userData?.id || user?.id}`) || userData?.pfp ? (
                <img 
                  src={getProfilePhotoSrc()} 
                  alt="Profile" 
                  className="profile-photo"
                  onError={(e) => {
                    e.target.src = 'cdn/user_pfp/NotFound.jpg';
                  }}
                />
              ) : (
                <User size={56} strokeWidth={2} />
              )}
              {isEditing && (
                <div className="photo-overlay">
                  <Camera size={24} />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            <div className="profile-info">
              <h1>{userData?.firstName && userData?.lastName ? `${userData.firstName} ${userData.lastName}` : user?.name || 'User Name'}</h1>
              <p className="profile-role">
                <MapPin size={16} />
                Event Attendee
              </p>
            </div>
          </div>
          <button 
            className={`edit-btn-circle ${isEditing ? 'editing' : ''}`}
            onClick={() => setIsEditing(!isEditing)}
            aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
          >
            {isEditing ? <X size={28} strokeWidth={2.5} /> : <Edit2 size={28} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="profile-content">
          {/* Personal Information Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>
                <User size={24} />
                Personal Information
              </h2>
            </div>
            
            <div className="name-row">
              <div className="form-group">
                <label>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="form-input"
                  />
                ) : (
                  <div className="form-value">{userData?.firstName || 'Not provided'}</div>
                )}
              </div>

              <div className="form-group">
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="form-input"
                  />
                ) : (
                  <div className="form-value">{userData?.lastName || 'Not provided'}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>
                <Mail size={16} />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input"
                />
              ) : (
                <div className="form-value">{userData?.email || user?.email || 'Not provided'}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <Phone size={16} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="form-input"
                />
              ) : (
                <div className="form-value">{userData?.phone || user?.phoneNumber || 'Not provided'}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <Calendar size={16} />
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <div className="form-value">
                  {userData?.dob ? new Date(userData.dob).toLocaleDateString() : (user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided')}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              ) : (
                <div className="form-value">{userData?.gender || user?.gender || 'Not provided'}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <MapPin size={16} />
                Address
              </label>
              {formData.address ? (
                <div className={`location-display ${isEditing ? 'editing' : ''}`}>
                  <MapPin size={20} />
                  <a 
                    href={getAddressLink()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="location-link"
                  >
                    {getLocationText()}
                    <ExternalLink size={16} />
                  </a>
                  {isEditing && (
                    <button 
                      type="button" 
                      onClick={() => setShowLocationModal(true)}
                      className="edit-location-btn"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="location-empty">
                  {isEditing ? (
                    <button 
                      type="button" 
                      onClick={() => setShowLocationModal(true)}
                      className="add-location-btn"
                    >
                      <Plus size={20} />
                      Add Location
                    </button>
                  ) : (
                    <div className="no-location">
                      <MapPin size={20} />
                      No location added
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>About Me</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  className="form-textarea"
                />
              ) : (
                <div className="form-value bio-text">
                  {user?.bio || 'No bio provided'}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="form-actions">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="save-btn"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="cancel-btn"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Activity Stats Section */}
          <div className="stats-section">
            <div className="stats-container">
              <div className="section-header">
                <h2>
                  <Award size={24} />
                  Activity Stats
                </h2>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Ticket size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>12</h3>
                    <p>Events Attended</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Calendar size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>3</h3>
                    <p>Upcoming Events</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Heart size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>8</h3>
                    <p>Favorite Events</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Location</h3>
              <button onClick={() => setShowLocationModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={locationForm.street}
                  onChange={(e) => setLocationForm({ ...locationForm, street: e.target.value })}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  <select
                    value={locationForm.state}
                    onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value, city: '' })}
                  >
                    <option value="">Select State</option>
                    {Object.keys(indianStates).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>City</label>
                  <select
                    value={locationForm.city}
                    onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                    disabled={!locationForm.state}
                  >
                    <option value="">Select City</option>
                    {locationForm.state && indianStates[locationForm.state]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    value={locationForm.zipCode}
                    onChange={(e) => setLocationForm({ ...locationForm, zipCode: e.target.value })}
                    placeholder="10001"
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={locationForm.country}
                    disabled
                    style={{ background: '#f9fafb', color: '#6b7280' }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleAddLocation} disabled={!locationForm.city || !locationForm.state}>
                Add Location
              </button>
              <button onClick={() => setShowLocationModal(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;