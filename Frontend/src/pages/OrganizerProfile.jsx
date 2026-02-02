import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api, apiClient } from '../services/api';
import { User, Mail, Phone, MapPin, Upload, Camera, Save, FileText, CheckCircle, AlertCircle, Edit2, X, Map, Plus, ExternalLink, Building } from 'lucide-react';
import DocumentUpload from '../components/DocumentUpload';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div 
                className="relative w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300"
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                {profilePhotoPreview || localStorage.getItem(`profilePhoto_${user?.id}`) || profile.pfp ? (
                  <img 
                    src={getProfilePhotoSrc()} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = 'cdn/user_pfp/NotFound.jpg';
                    }}
                  />
                ) : (
                  <User size={56} className="text-white" strokeWidth={2} />
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Camera size={24} className="text-white" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {isEditing && profilePhoto && (
                <button 
                  onClick={handlePhotoUpload}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Update Photo
                </button>
              )}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {(profile.firstName && profile.lastName) ? `${profile.firstName} ${profile.lastName}` : (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : 'Organizer Name'}
                </h1>
                <p className="text-white/80 flex items-center justify-center lg:justify-start gap-2">
                  <MapPin size={16} />
                  Event Organizer
                </p>
              </div>
            </div>
            <button 
              className={`w-14 h-14 rounded-full backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-all duration-300 ${
                isEditing ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
            >
              {isEditing ? <X size={28} strokeWidth={2.5} /> : <Edit2 size={28} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'profile' 
                ? 'bg-white text-gray-900 shadow-lg' 
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            Profile Details
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'documents' 
                ? 'bg-white text-gray-900 shadow-lg' 
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
            }`}
            onClick={() => setActiveTab('documents')}
          >
            <FileText size={20} />
            Documents
          </button>
        </div>
        <div className="space-y-8">
          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                {/* Basic Information Section */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <User className="w-6 h-6 mr-3 text-teal-400" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/90">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          disabled={!isEditing}
                          required
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                            isEditing 
                              ? '!bg-white !border-gray-300 !text-gray-900 placeholder-gray-500 focus:!border-teal-400 focus:ring-2 focus:ring-teal-400/50' 
                              : 'bg-white/10 border-white/20 text-white/80'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/90">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          disabled={!isEditing}
                          required
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                            isEditing 
                              ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50' 
                              : 'bg-white/10 border-white/20 text-white/80'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/90">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!isEditing}
                          required
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                            isEditing 
                              ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50' 
                              : 'bg-white/10 border-white/20 text-white/80'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/90">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.address ? getLocationText() : ''}
                          placeholder="Click to add location"
                          disabled={!isEditing}
                          readOnly
                          onClick={() => isEditing && setShowLocationModal(true)}
                          className={`w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden text-ellipsis ${
                            isEditing 
                              ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50' 
                              : 'bg-white/10 border-white/20 text-white/80'
                          }`}
                        />
                        {isEditing && (
                          <button 
                            type="button" 
                            onClick={() => setShowLocationModal(true)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <FileText className="w-6 h-6 mr-3 text-teal-400" />
                    Professional Information
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/90">Company/Organization</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.organization}
                          onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                          placeholder="Your organization name"
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                            isEditing 
                              ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50' 
                              : 'bg-white/10 border-white/20 text-white/80'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/90">Bio</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          placeholder="Tell us about yourself and your event organizing experience..."
                          rows="4"
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 resize-none ${
                            isEditing 
                              ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50' 
                              : 'bg-white/10 border-white/20 text-white/80'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-all duration-300 flex items-center space-x-2 shadow-lg"
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
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
                <DocumentUpload />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowLocationModal(false)}>
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h3 className="text-xl font-semibold text-white">Add Location</h3>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} className="text-white/80" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">Street Address</label>
                <input
                  type="text"
                  value={locationForm.street}
                  onChange={(e) => setLocationForm({ ...locationForm, street: e.target.value })}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">State</label>
                  <select
                    value={locationForm.state}
                    onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value, city: '' })}
                    className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/20 backdrop-blur-sm text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  >
                    <option value="" className="bg-gray-800 text-white">Select State</option>
                    {Object.keys(indianStates).map(state => (
                      <option key={state} value={state} className="bg-gray-800 text-white">{state}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">City</label>
                  <select
                    value={locationForm.city}
                    onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                    disabled={!locationForm.state}
                    className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/20 backdrop-blur-sm text-white disabled:bg-white/10 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  >
                    <option value="" className="bg-gray-800 text-white">Select City</option>
                    {locationForm.state && indianStates[locationForm.state]?.map(city => (
                      <option key={city} value={city} className="bg-gray-800 text-white">{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">ZIP Code</label>
                  <input
                    type="text"
                    value={locationForm.zipCode}
                    onChange={(e) => setLocationForm({ ...locationForm, zipCode: e.target.value })}
                    placeholder="10001"
                    className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">Country</label>
                  <input
                    type="text"
                    value={locationForm.country}
                    disabled
                    className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white/60"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-white/20">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLocation}
                disabled={!locationForm.city || !locationForm.state}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerProfile;