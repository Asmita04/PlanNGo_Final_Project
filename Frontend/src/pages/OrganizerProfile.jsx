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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: '',
    organization: '',
    address: '',
    pfp: user?.avatar || ''
  });
  const [originalProfile, setOriginalProfile] = useState({ ...profile });

  const [documents, setDocuments] = useState([]);
  const [aadharCard, setAadharCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [locations, setLocations] = useState([]);

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
      await apiClient.post(`/users/upload/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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

      await apiClient.put(`/organizer/profile/${userId}`, profileData, {
        headers: { 'Content-Type': 'application/json' }
      });

      const updatedUser = {
        ...user,
        ...profileData
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      updateUser(updatedUser);

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
      try {
        const urlParams = new URLSearchParams(profile.address.split('?')[1]);
        return decodeURIComponent(urlParams.get('query') || 'View Location');
      } catch (e) { return 'View Location'; }
    }
    return profile.address || 'View Location';
  };

  const getAddressLink = () => {
    if (!profile.address) return '#';
    if (profile.address.startsWith('http')) return profile.address;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`;
  };

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setIsEditing(false);
  };

  // Consistent styling classes
  const inputClasses = "w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all font-medium shadow-inner";
  const viewClasses = "w-full bg-white/5 text-slate-200 border border-white/10 rounded-xl py-3 pl-11 pr-4 font-medium min-h-[50px] flex items-center break-all";
  const iconClasses = "absolute left-3.5 top-1/2 -translate-y-1/2 text-white/90 z-10";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div
              className="relative group cursor-pointer"
              onClick={() => isEditing && fileInputRef.current?.click()}
            >
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.5)]">
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden relative">
                  {profilePhotoPreview || localStorage.getItem(`profilePhoto_${user?.id}`) || profile.pfp ? (
                    <img
                      src={getProfilePhotoSrc()}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => { e.target.src = 'cdn/user_pfp/NotFound.jpg'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <User size={48} className="text-slate-400" />
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera size={24} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-teal-500 p-2 rounded-full shadow-lg border-4 border-slate-900 transform translate-x-1 translate-y-1">
                  <Camera size={16} className="text-white" />
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

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                {(profile.firstName && profile.lastName) ? `${profile.firstName} ${profile.lastName}` : (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : 'Organizer Name'}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-sm font-medium border border-teal-500/20 backdrop-blur-md">
                  Event Organizer
                </span>
                {getLocationText() && getLocationText() !== 'View Location' && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin size={14} className="text-teal-400" />
                    {getLocationText().split(',')[0]}
                  </span>
                )}
              </div>

              {isEditing && profilePhoto && (
                <button
                  onClick={handlePhotoUpload}
                  className="mt-4 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-teal-500/20"
                >
                  Save New Photo
                </button>
              )}
            </div>

            <button
              className={`p-3 transition-colors duration-300 ${isEditing ? 'text-red-400 hover:text-red-300' : 'text-white hover:text-teal-400'}`}
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
            >
              {isEditing ? <X size={24} /> : <Edit2 size={24} />}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'profile'
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:text-white'
              }`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            Profile Details
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'documents'
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:text-white'
              }`}
            onClick={() => setActiveTab('documents')}
          >
            <FileText size={20} />
            Documents
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Profile Form */}
              <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <form onSubmit={handleProfileUpdate} className="space-y-8">
                  {/* Basic Information Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                        <User size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">First Name</label>
                        <div className="relative group">
                          <User className={iconClasses} size={18} />
                          {isEditing ? (
                            <input
                              type="text"
                              value={profile.firstName}
                              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                              className={inputClasses}
                            />
                          ) : (
                            <div className={viewClasses}>{profile.firstName || 'Not provided'}</div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Last Name</label>
                        <div className="relative group">
                          <User className={iconClasses} size={18} />
                          {isEditing ? (
                            <input
                              type="text"
                              value={profile.lastName}
                              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                              className={inputClasses}
                            />
                          ) : (
                            <div className={viewClasses}>{profile.lastName || 'Not provided'}</div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                        <div className="relative group">
                          <Phone className={iconClasses} size={18} />
                          {isEditing ? (
                            <input
                              type="tel"
                              value={profile.phone}
                              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                              className={inputClasses}
                            />
                          ) : (
                            <div className={viewClasses}>{profile.phone || 'Not provided'}</div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Location</label>
                        <div className={`relative group ${isEditing ? 'cursor-pointer' : ''}`}>
                          <MapPin className={iconClasses} size={18} />
                          {getLocationText() && getLocationText() !== 'View Location' ? (
                            <div className={`w-full rounded-xl py-3 pl-11 pr-12 min-h-[50px] flex items-center transition-all ${isEditing ? 'bg-slate-900 text-white border border-slate-700 shadow-inner' : 'bg-white/5 text-slate-200 border border-white/10'}`}>
                              <a
                                href={getAddressLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate hover:text-teal-500 transition-colors flex-1"
                              >
                                {getLocationText()}
                              </a>
                              <a href={getAddressLink()} target="_blank" rel="noopener noreferrer" className="absolute right-4 text-slate-400 hover:text-teal-500 transition-colors">
                                <ExternalLink size={16} />
                              </a>
                            </div>
                          ) : (
                            <div className={`w-full rounded-xl py-3 pl-11 pr-4 min-h-[50px] flex items-center ${isEditing ? 'bg-slate-900 text-slate-500 border border-slate-700 border-dashed hover:border-teal-500 shadow-inner' : 'bg-white/5 text-slate-500 border border-white/10 border-dashed'}`}>
                              {isEditing ? (
                                <button
                                  type="button"
                                  onClick={() => setShowLocationModal(true)}
                                  className="flex items-center gap-2 text-sm font-medium hover:text-teal-400 transition-colors w-full h-full text-left"
                                >
                                  Click to add address
                                </button>
                              ) : (
                                <span>No location added</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        <Building size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white">Professional Information</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Company/Organization</label>
                        <div className="relative group">
                          <Building className={iconClasses} size={18} />
                          {isEditing ? (
                            <input
                              type="text"
                              value={profile.organization}
                              onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                              placeholder="Your organization name"
                              className={inputClasses}
                            />
                          ) : (
                            <div className={viewClasses}>{profile.organization || 'Not provided'}</div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Bio</label>
                        <div className="relative group">
                          <FileText className="absolute left-3.5 top-4 text-white/90 z-10" size={18} />
                          {isEditing ? (
                            <textarea
                              value={profile.bio}
                              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                              placeholder="Tell us about yourself..."
                              rows="4"
                              className={`${inputClasses} py-4 resize-none`}
                            />
                          ) : (
                            <div className="w-full bg-white/5 text-slate-200 border border-white/10 rounded-xl py-4 pl-11 pr-4 font-medium min-h-[120px] leading-relaxed">
                              {profile.bio || 'No bio provided'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Save size={20} />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3.5 rounded-xl font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <X size={20} />
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Right Side - Maybe Stats or Quick Links in future */}
              <div className="lg:col-span-1 space-y-6">
                {/* Placeholders for Organizer Stats if any */}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
              <DocumentUpload />
            </div>
          )}
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowLocationModal(false)}>
          <div className="bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
              <h3 className="text-xl font-bold text-white">Add Location</h3>
              <button onClick={() => setShowLocationModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  value={locationForm.street}
                  onChange={(e) => setLocationForm({ ...locationForm, street: e.target.value })}
                  placeholder="123 Main Street"
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">State</label>
                  <select
                    value={locationForm.state}
                    onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value, city: '' })}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-teal-500 outline-none appearance-none"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Select State</option>
                    {Object.keys(indianStates).map(state => (
                      <option key={state} value={state} className="bg-slate-900 text-white">{state}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">City</label>
                  <select
                    value={locationForm.city}
                    onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                    disabled={!locationForm.state}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-teal-500 outline-none appearance-none disabled:opacity-50"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Select City</option>
                    {locationForm.state && indianStates[locationForm.state]?.map(city => (
                      <option key={city} value={city} className="bg-slate-900 text-white">{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ZIP Code</label>
                  <input
                    type="text"
                    value={locationForm.zipCode}
                    onChange={(e) => setLocationForm({ ...locationForm, zipCode: e.target.value })}
                    placeholder="10001"
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Country</label>
                  <input
                    type="text"
                    value={locationForm.country}
                    disabled
                    className="w-full bg-slate-900/50 text-slate-400 border border-slate-700 rounded-xl py-3 px-4"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={handleAddLocation}
                disabled={!locationForm.city || !locationForm.state}
                className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Location
              </button>
              <button onClick={() => setShowLocationModal(false)} className="px-6 py-2 text-slate-300 hover:text-white font-medium transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerProfile;