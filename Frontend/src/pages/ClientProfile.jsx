import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api, apiClient } from '../services';
import { User, Mail, Phone, Calendar, Edit2, Save, X, Award, Ticket, Heart, MapPin, Camera } from 'lucide-react';
import './ClientProfile.css';

const ClientProfile = () => {
  const { user, updateUser, addNotification } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const userId = userData?.id || user?.id;
      
      const formDataToSend = new FormData();
      const userJson = JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        dob: formData.dateOfBirth,
        bio: formData.bio
      });
      formDataToSend.append('user', userJson);
      
      if (profilePhoto) {
        formDataToSend.append('image', profilePhoto);
      }
      
      const response = await apiClient.put(`/users/customer/profile/${userId}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update localStorage with new data
      const updatedUser = {
        ...userData,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        dob: formData.dateOfBirth,
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
    </div>
  );
};

export default ClientProfile;