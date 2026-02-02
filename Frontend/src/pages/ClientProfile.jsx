import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api, apiClient } from '../services';
import { User, Mail, Phone, Calendar, Edit2, Save, X, Award, Ticket, Heart, MapPin, Camera, Plus, ExternalLink, FileText } from 'lucide-react';

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

  const getUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      return parsed;
    }
    return user;
  };

  const userData = getUserData();

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

  const handlePhotoUpload = async () => {
    if (!profilePhoto) return;

    const userId = userData?.id || user?.id;
    const formDataObj = new FormData();
    formDataObj.append('file', profilePhoto);

    try {
      await apiClient.post(`/users/upload/${userId}`, formDataObj, {
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

  const handleAddLocation = () => {
    const fullAddress = `${locationForm.street}, ${locationForm.city}, ${locationForm.state} ${locationForm.zipCode}, ${locationForm.country}`;

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
      try {
        const urlParams = new URLSearchParams(formData.address.split('?')[1]);
        return decodeURIComponent(urlParams.get('query') || 'View Location');
      } catch (e) {
        return 'View Location';
      }
    }
    return formData.address || 'View Location';
  };

  const getAddressLink = () => {
    const raw = formData.address || userData?.address || formData.locationText || userData?.locationText;
    if (!raw) return '#';
    if (typeof raw === 'string' && (raw.startsWith('http://') || raw.startsWith('https://'))) return raw;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userId = userData?.id || user?.id;

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

      const response = await apiClient.put(`/customer/profile/${userId}`, profileData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

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

  // Helper for input classes to ensure consistency
  // "make gender and location field dark aswell" - ensuring consistent dark inputs
  const inputClasses = `w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all font-medium shadow-inner`;
  const viewClasses = `w-full bg-white/5 text-slate-200 border border-white/10 rounded-xl py-3 pl-11 pr-4 font-medium min-h-[50px] flex items-center break-all`;

  // "show react icons in editing mode in white color"
  const iconClasses = `absolute left-3.5 top-1/2 -translate-y-1/2 text-white/90 z-10`;

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
              {/* "add teal gradient arround profile" */}
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.5)]">
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden relative">
                  {profilePhotoPreview || localStorage.getItem(`profilePhoto_${userData?.id || user?.id}`) || userData?.pfp ? (
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
                {userData?.firstName && userData?.lastName ? `${userData.firstName} ${userData.lastName}` : user?.name || 'User Name'}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300">
                <span className="px-3 py-1 rounded-full bg-white/10 text-sm font-medium border border-white/10 backdrop-blur-md">
                  Event Enthusiast
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
              onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
              aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
            >
              {isEditing ? <X size={24} /> : <Edit2 size={24} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Form */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <User size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Personal Information</h2>
            </div>

            <div className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">First Name</label>
                  <div className="relative group">
                    <User className={iconClasses} size={18} />
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className={inputClasses}
                      />
                    ) : (
                      <div className={viewClasses}>
                        {userData?.firstName || 'Not provided'}
                      </div>
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
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className={inputClasses}
                      />
                    ) : (
                      <div className={viewClasses}>
                        {userData?.lastName || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className={iconClasses} size={18} />
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={inputClasses}
                      />
                    ) : (
                      <div className={viewClasses}>
                        {userData?.email || user?.email || 'Not provided'}
                      </div>
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
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={inputClasses}
                      />
                    ) : (
                      <div className={viewClasses}>
                        {userData?.phone || user?.phoneNumber || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Date of Birth</label>
                  <div className="relative group">
                    <Calendar className={iconClasses} size={18} />
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`${inputClasses} [color-scheme:dark]`}
                      />
                    ) : (
                      <div className={viewClasses}>
                        {userData?.dob ? new Date(userData.dob).toLocaleDateString() : (user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Gender</label>
                  <div className="relative group">
                    <User className={iconClasses} size={18} />
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`${inputClasses} appearance-none`}
                        style={{ backgroundColor: '#0f172a' }} // Force bg for select options
                      >
                        <option value="" className="bg-slate-900 text-slate-400">Select Gender</option>
                        <option value="male" className="bg-slate-900 text-white">Male</option>
                        <option value="female" className="bg-slate-900 text-white">Female</option>
                      </select>
                    ) : (
                      <div className={viewClasses}>
                        {userData?.gender || user?.gender || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Address</label>
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

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">About Me</label>
                <div className="relative group">
                  <FileText className="absolute left-3.5 top-4 text-white/90 z-10" size={18} />
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      rows="4"
                      className={`${inputClasses} py-4 resize-none`}
                    />
                  ) : (
                    <div className="w-full bg-white/5 text-slate-200 border border-white/10 rounded-xl py-4 pl-11 pr-4 font-medium min-h-[120px] leading-relaxed">
                      {user?.bio || 'No bio provided'}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <button
                    onClick={handleSave}
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
                    onClick={handleCancel}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3.5 rounded-xl font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Award size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Activity Stats</h2>
              </div>

              <div className="space-y-4">
                <div className="group bg-slate-900/50 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Ticket size={24} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">12</h3>
                      <p className="text-sm text-slate-400 font-medium">Events Attended</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-slate-900/50 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white group-hover:text-amber-400 transition-colors">3</h3>
                      <p className="text-sm text-slate-400 font-medium">Upcoming Events</p>
                    </div>
                  </div>
                </div>


              </div>
            </div>


          </div>
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
                    <option value="">Select State</option>
                    {Object.keys(indianStates).map(state => (
                      <option key={state} value={state}>{state}</option>
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
                    <option value="">Select City</option>
                    {locationForm.state && indianStates[locationForm.state]?.map(city => (
                      <option key={city} value={city}>{city}</option>
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

export default ClientProfile;