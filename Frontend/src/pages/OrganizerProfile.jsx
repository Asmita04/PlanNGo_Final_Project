import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api, apiClient } from '../services/api';
import { User, Mail, Phone, MapPin, Upload, Camera, Save, FileText, CheckCircle, AlertCircle, Edit2, X, Map, Plus, ExternalLink } from 'lucide-react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import './OrganizerProfile.css';

const OrganizerProfile = () => {
  const { user, updateUser, addNotification } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: '',
    organization: '',
    address: '',
    pfp: user?.avatar || ''
  });
  const [originalProfile, setOriginalProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: '',
    organization: '',
    address: '',
    pfp: user?.avatar || ''
  });
  const [documents, setDocuments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
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

  useEffect(() => {
    if (user?.id) {
      loadProfile();
      loadLocations();
    }
  }, [user?.id]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : user;
    
    if (userData && !isEditing) {
      setProfile({
        firstName: userData.firstName || user?.firstName || '',
        lastName: userData.lastName || user?.lastName || '',
        phone: userData.phone || user?.phone || '',
        bio: userData.bio || '',
        organization: userData.organization || '',
        address: userData.address || '',
        pfp: userData.pfp || user?.avatar || ''
      });
    }
  }, [user, isEditing]);

  const loadProfile = async () => {
    try {
      const profileData = await api.getOrganizerProfile(user.id);
      const updatedProfile = { ...profile, ...profileData };
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setDocuments(profileData.documents || []);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const locationData = await api.getPredefinedLocations();
      setLocations(locationData);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
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

  const getProfilePhotoSrc = () => {
    const userId = user?.id;
    if (profilePhotoPreview) return profilePhotoPreview;
    
    const savedPhoto = localStorage.getItem(`profilePhoto_${userId}`);
    if (savedPhoto) return savedPhoto;
    
    if (profile.pfp) return profile.pfp;
    
    return 'cdn/user_pfp/NotFound.jpg';
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = user?.id;
      
      const profileData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        bio: profile.bio,
        organization: profile.organization,
        address: profile.address,
        pfp: profile.pfp
      };
      
      console.log('Sending profile data:', profileData);
      
      const response = await apiClient.put(`/organizer/profile/${userId}`, profileData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Update localStorage with new data
      const updatedUser = {
        ...user,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        bio: profile.bio,
        organization: profile.organization,
        address: profile.address,
        pfp: profile.pfp
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Updated localStorage:', updatedUser);
      
      updateUser({ ...user, ...response.data });
      setOriginalProfile(profile);
      setIsEditing(false);
      addNotification({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Profile update error:', error);
      addNotification({ message: 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    const fullAddress = `${locationForm.street}, ${locationForm.city}, ${locationForm.state} ${locationForm.zipCode}, ${locationForm.country}`;
    const locationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    
    setProfile({
      ...profile,
      address: locationUrl,
      locationText: fullAddress
    });
    
    setShowLocationModal(false);
    setLocationForm({ street: '', city: '', state: '', zipCode: '', country: 'India' });
  };

  const getLocationText = () => {
    if (profile.locationText) return profile.locationText;
    if (profile.address && profile.address.includes('google.com/maps')) {
      const urlParams = new URLSearchParams(profile.address.split('?')[1]);
      return decodeURIComponent(urlParams.get('query') || 'View Location');
    }
    return profile.address || 'View Location';
  };

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setIsEditing(false);
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', 'verification');

    try {
      const response = await api.uploadDocument(user.id, formData);
      setDocuments([...documents, response]);
      addNotification({ message: 'Document uploaded successfully!', type: 'success' });
    } catch (error) {
      addNotification({ message: 'Failed to upload document', type: 'error' });
    }
  };

  const getVerificationStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="text-green-500" size={20} />;
      case 'pending': return <AlertCircle className="text-yellow-500" size={20} />;
      default: return <AlertCircle className="text-red-500" size={20} />;
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className={`profile-avatar ${isEditing ? 'editing' : ''}`} onClick={() => isEditing && fileInputRef.current?.click()}>
            {profilePhotoPreview || localStorage.getItem(`profilePhoto_${user?.id}`) || profile.pfp ? (
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
                <span>Change Photo</span>
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
            <h1>{(profile.firstName && profile.lastName) ? `${profile.firstName} ${profile.lastName}` : (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : 'Organizer Name'}</h1>
            <p>{profile.organization}</p>
            <div className="verification-status">
              {getVerificationStatusIcon(profile.verificationStatus)}
              <span>Verification Status: {profile.verificationStatus}</span>
            </div>
          </div>
          <button 
            className={`edit-btn-circle ${isEditing ? 'editing' : ''}`}
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
          >
            {isEditing ? (
              <>
                <X size={16} strokeWidth={2.5} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit2 size={16} strokeWidth={2.5} />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>

        <div className="profile-tabs">
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            Profile Details
          </button>
          <button 
            className={activeTab === 'documents' ? 'active' : ''} 
            onClick={() => setActiveTab('documents')}
          >
            <FileText size={20} />
            Documents
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    {profile.address ? (
                      <div className={`location-display ${isEditing ? 'editing' : ''}`}>
                        <MapPin size={20} />
                        <a 
                          href={profile.address} 
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
                </div>
              </div>

              <div className="form-section">
                <h3>Professional Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company/Organization</label>
                    <input
                      type="text"
                      value={profile.organization}
                      onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                      placeholder="Your organization name"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell us about yourself and your event organizing experience..."
                    rows="4"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <Button type="submit" disabled={loading} icon={<Save size={20} />}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button type="button" onClick={handleCancel} variant="secondary" icon={<X size={20} />}>
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          )}

          {activeTab === 'documents' && (
            <div className="documents-section">
              <div className="documents-header">
                <h3>Verification Documents</h3>
                <label className="upload-btn">
                  <Upload size={20} />
                  Upload Document
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocumentUpload} hidden />
                </label>
              </div>

              <div className="documents-list">
                {documents.length === 0 ? (
                  <div className="empty-state">
                    <FileText size={64} />
                    <h4>No documents uploaded</h4>
                    <p>Upload verification documents to complete your profile</p>
                  </div>
                ) : (
                  documents.map(doc => (
                    <div key={doc.id} className="document-item">
                      <div className="document-info">
                        <FileText size={24} />
                        <div>
                          <h4>{doc.name}</h4>
                          <p>Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="document-status">
                        {getVerificationStatusIcon(doc.status)}
                        <span>{doc.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="verification-info">
                <h4>Required Documents</h4>
                <ul>
                  <li>Government-issued ID (Driver's License, Passport, etc.)</li>
                  <li>Business License or Registration (if applicable)</li>
                  <li>Tax ID or EIN documentation</li>
                  <li>Insurance certificate (for events)</li>
                </ul>
              </div>
            </div>
          )}
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
              <Button onClick={handleAddLocation} disabled={!locationForm.city || !locationForm.state}>
                Add Location
              </Button>
              <Button onClick={() => setShowLocationModal(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerProfile;