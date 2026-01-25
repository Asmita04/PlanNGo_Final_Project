import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { User, Mail, Phone, MapPin, Upload, Camera, Save, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import './OrganizerProfile.css';

const OrganizerProfile = () => {
  const { user, updateUser, addNotification } = useApp();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: '',
    company: '',
    website: '',
    location: '',
    profilePicture: user?.avatar || '',
    verificationStatus: 'pending'
  });
  const [documents, setDocuments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user?.id) {
      loadProfile();
      loadLocations();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    try {
      const profileData = await api.getOrganizerProfile(user.id);
      setProfile(prev => ({ ...prev, ...profileData }));
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedProfile = await api.updateOrganizerProfile(user.id, profile);
      updateUser({ ...user, ...updatedProfile });
      addNotification({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      addNotification({ message: 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await api.uploadProfilePicture(user.id, formData);
      setProfile({ ...profile, profilePicture: response.url });
      addNotification({ message: 'Profile picture updated!', type: 'success' });
    } catch (error) {
      addNotification({ message: 'Failed to upload image', type: 'error' });
    }
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
          <div className="profile-avatar">
            <img src={profile.profilePicture} alt={profile.name} />
            <label className="avatar-upload">
              <Camera size={20} />
              <input type="file" accept="image/*" onChange={handleProfilePictureUpload} hidden />
            </label>
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p>{profile.company}</p>
            <div className="verification-status">
              {getVerificationStatusIcon(profile.verificationStatus)}
              <span>Verification Status: {profile.verificationStatus}</span>
            </div>
          </div>
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
                    <label>Full Name</label>
                    <div className="input-wrapper">
                      <User size={20} />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper disabled">
                      <Mail size={20} />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        title="Email cannot be changed"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-wrapper">
                      <Phone size={20} />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <div className="input-wrapper">
                      <MapPin size={20} />
                      <select
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      >
                        <option value="">Select Location</option>
                        {locations.map(location => (
                          <option key={location.id} value={location.name}>
                            {location.name}
                          </option>
                        ))}
                      </select>
                    </div>
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
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
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
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} icon={<Save size={20} />}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
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
    </div>
  );
};

export default OrganizerProfile;