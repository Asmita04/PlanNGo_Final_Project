import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api, apiClient } from '../services/api';
import { User, Mail, Phone, MapPin, Upload, Camera, Save, FileText, CheckCircle, AlertCircle, Edit2, X, Map, Plus, ExternalLink } from 'lucide-react';
import DocumentUpload from '../components/DocumentUpload';
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
  const [aadharCard, setAadharCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
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

  const handlePhotoUpload = async () => {
    if (!profilePhoto) return;
    
    const userId = user?.id;
    const formData = new FormData();
    formData.append('file', profilePhoto);
    
    try {
      const response = await apiClient.post(`/users/upload/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      addNotification({ message: 'Profile photo updated successfully! 🎉', type: 'success' });
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
    } catch (error) {
      console.error('Photo upload error:', error);
      addNotification({ 
        message: error.response?.data?.message || 'Failed to upload photo', 
        type: 'error' 
      });
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

  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleDocumentSelect = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (docType === 'aadhar') {
      setAadharFile(file);
    } else if (docType === 'pan') {
      setPanFile(file);
    }
  };

  const uploadBothDocuments = async () => {
    if (!aadharFile || !panFile) {
      addNotification({ message: 'Please select both Aadhar and PAN documents', type: 'error' });
      return;
    }

    try {
      const aadharBase64 = await convertToBase64(aadharFile);
      const panBase64 = await convertToBase64(panFile);
      
      const documentData = {
        documents: [
          { type: 'aadhar', file: aadharBase64 },
          { type: 'pan', file: panBase64 }
        ]
      };

      const response = await apiClient.post(`/organizer/documents/${user.id}`, documentData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setAadharCard(response.data.find(doc => doc.type === 'aadhar'));
      setPanCard(response.data.find(doc => doc.type === 'pan'));
      
      addNotification({ message: 'Documents uploaded successfully!', type: 'success' });
      setAadharFile(null);
      setPanFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      addNotification({ message: 'Failed to upload documents', type: 'error' });
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
          <div className="header-content">
            <div className="profile-avatar" onClick={() => isEditing && fileInputRef.current?.click()}>
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
            {isEditing && profilePhoto && (
              <button 
                onClick={handlePhotoUpload}
                className="upload-photo-btn"
              >
                Update Photo
              </button>
            )}
            <div className="profile-info">
              <h1>{(profile.firstName && profile.lastName) ? `${profile.firstName} ${profile.lastName}` : (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : 'Organizer Name'}</h1>
              <p className="profile-role">
                <MapPin size={16} />
                Event Organizer
              </p>
            </div>
          </div>
          <button 
            className={`edit-btn-circle ${isEditing ? 'editing' : ''}`}
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
          >
            {isEditing ? <X size={28} strokeWidth={2.5} /> : <Edit2 size={28} strokeWidth={2.5} />}
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
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        disabled={!isEditing}
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isEditing 
                            ? 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        disabled={!isEditing}
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isEditing 
                            ? 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!isEditing}
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isEditing 
                            ? 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      {profile.address ? (
                        <div className={`flex items-center space-x-3 p-3 rounded-lg border ${
                          isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                        }`}>
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <a 
                            href={profile.address} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 text-indigo-600 hover:text-indigo-800 flex items-center space-x-2"
                          >
                            <span className="truncate">{getLocationText()}</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          {isEditing && (
                            <button 
                              type="button" 
                              onClick={() => setShowLocationModal(true)}
                              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                          {isEditing ? (
                            <button 
                              type="button" 
                              onClick={() => setShowLocationModal(true)}
                              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                              <Plus className="w-5 h-5" />
                              <span>Add Location</span>
                            </button>
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-500">
                              <MapPin className="w-5 h-5" />
                              <span>No location added</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                    Professional Information
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Company/Organization</label>
                      <input
                        type="text"
                        value={profile.organization}
                        onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                        placeholder="Your organization name"
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isEditing 
                            ? 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Tell us about yourself and your event organizing experience..."
                        rows="4"
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                          isEditing 
                            ? 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="max-w-4xl mx-auto">
              <DocumentUpload />
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