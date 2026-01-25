import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { User, Mail, Phone, Calendar, Edit2, Save, X } from 'lucide-react';
import './ClientProfile.css';

const ClientProfile = () => {
  const { user, updateUser, addNotification } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.updateUserProfile(formData);
      updateUser(response.user);
      addNotification({ message: 'Profile updated successfully! 🎉', type: 'success' });
      setIsEditing(false);
    } catch (error) {
      addNotification({ message: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      dateOfBirth: user.dateOfBirth || '',
      bio: user.bio || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p className="profile-role">Event Attendee</p>
          </div>
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X size={20} /> : <Edit2 size={20} />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            
            <div className="form-group">
              <label>
                <User size={16} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <p>{user?.name || 'Not provided'}</p>
              )}
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
                />
              ) : (
                <p>{user?.email || 'Not provided'}</p>
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
                />
              ) : (
                <p>{user?.phoneNumber || 'Not provided'}</p>
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
                />
              ) : (
                <p>{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
              )}
            </div>

            <div className="form-group">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              ) : (
                <p>{user?.bio || 'No bio provided'}</p>
              )}
            </div>

            {isEditing && (
              <div className="form-actions">
                <button 
                  className="save-btn"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-stats">
            <h2>Activity Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>0</h3>
                <p>Events Attended</p>
              </div>
              <div className="stat-card">
                <h3>0</h3>
                <p>Upcoming Events</p>
              </div>
              <div className="stat-card">
                <h3>0</h3>
                <p>Favorite Events</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;