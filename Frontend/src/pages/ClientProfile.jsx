import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { User, Mail, Phone, Calendar, Edit2, Save, X, Award, Ticket, Heart, MapPin } from 'lucide-react';
import './ClientProfile.css';

const ClientProfile = () => {
  const { user, updateUser, addNotification } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || user?.email || '',
        phoneNumber: userData.phone || user?.phoneNumber || '',
        dateOfBirth: userData.dob || user?.dateOfBirth || '',
        bio: userData.bio || user?.bio || ''
      });
    }
  }, [userData, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Combine first and last name back to full name for backend
      const profileData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      };
      
      // Remove firstName and lastName as backend expects 'name'
      delete profileData.firstName;
      delete profileData.lastName;
      
      const response = await api.updateUserProfile(profileData);
      updateUser(response.user || response);
      addNotification({ message: 'Profile updated successfully! 🎉', type: 'success' });
      setIsEditing(false);
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
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header Card */}
        <div className="profile-header">
          <div className="header-content">
            <div className="profile-avatar">
              <User size={56} strokeWidth={2} />
            </div>
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