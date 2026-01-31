import { useState, useEffect } from 'react';

import { Users, Search, Filter, Edit, Trash2, Eye, X, MapPin, Mail, Phone, Calendar, User as UserIcon, Building, UserX, CheckCircle, FileText } from 'lucide-react';
import { api } from '../services';
import Button from '../components/Button';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);

    } finally {
      setLoading(false);
    }
  };


  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = activeTab === 'customers' ? user.userRole === 'ROLE_CUSTOMER' :
                       activeTab === 'organizers' ? user.userRole === 'ROLE_ORGANIZER' :
                       activeTab === 'admins' ? user.userRole === 'ROLE_ADMIN' : true;
    return matchesSearch && matchesRole;
  });

  const getRoleDisplayName = (role) => {
    if (role === 'ROLE_CUSTOMER') return 'Customer';
    if (role === 'ROLE_ORGANIZER') return 'Organizer';
    if (role === 'ROLE_ADMIN') return 'Admin';
    return role;
  };

  const getRoleBadgeClass = (role) => {
    if (role === 'ROLE_CUSTOMER') return 'role-customer';
    if (role === 'ROLE_ORGANIZER') return 'role-organizer';
    if (role === 'ROLE_ADMIN') return 'role-admin';
    return '';
  };

  const handleVerifyUser = async (Id, isVerified) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isVerified ? 'unverify' : 'verify';
      await axios.put(`http://localhost:9090/admin/${endpoint}/${Id}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      loadUsers();
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const renderUserDetails = (user) => {
    const details = [];
    
    if (user.firstName) details.push({ label: 'First Name', value: user.firstName, icon: UserIcon });
    if (user.lastName) details.push({ label: 'Last Name', value: user.lastName, icon: UserIcon });
    if (user.email) details.push({ label: 'Email', value: user.email, icon: Mail });
    if (user.phone) details.push({ label: 'Phone', value: user.phone, icon: Phone });
    if (user.dob) details.push({ label: 'Date of Birth', value: new Date(user.dob).toLocaleDateString(), icon: Calendar });
    if (user.gender) details.push({ label: 'Gender', value: user.gender, icon: UserIcon });
    if (user.bio) details.push({ label: 'Bio', value: user.bio, icon: UserIcon });
    if (user.organization) details.push({ label: 'Organization', value: user.organization, icon: Building });
    if (user.address) details.push({ 
      label: 'Address', 
      value: (
        <a href={user.address} target="_blank" rel="noopener noreferrer" className="address-link">
          View Location
        </a>
      ), 
      icon: MapPin 
    });
    
    return details;
  };

  const tabs = [
    { id: 'customers', label: 'Customers', icon: Users, role: 'ROLE_CUSTOMER' },
    { id: 'organizers', label: 'Organizers', icon: Building, role: 'ROLE_ORGANIZER' },
    { id: 'admins', label: 'Admins', icon: UserIcon, role: 'ROLE_ADMIN' }
  ];

  const renderUserTable = () => {
    if (filteredUsers.length === 0) {
      return (
        <div className="empty-state">
          <Users size={64} />
          <h3>No users found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      );
    }

    return (
      <div className="users-table">
        <div className="table-header">
          <span>User</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Actions</span>
        </div>
        {filteredUsers.map(user => (
          <div key={user.id} className="table-row">
            <div className="user-info">
              <div className="user-avatar">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div>
                <h4>{user.firstName} {user.lastName}</h4>
                <p>
                  {user.userRole === 'ROLE_ORGANIZER' ? (
                    <span className={`verification-status ${user.isVerified === true ? 'verified' : 'unverified'}`}>
                      {user.isVerified === true ? 'Verified' : 'Unverified'}
                    </span>
                  ) : (
                    <span className="user-role">{getRoleDisplayName(user.userRole)}</span>
                  )}
                </p>
              </div>
            </div>
            <span>{user.email}</span>
            <span>{user.phone || 'Not provided'}</span>
            <div className="actions">
              <Button variant="outline" size="sm" icon={<Eye size={16} />} onClick={() => handleViewDetails(user)}>
                View
              </Button>
              {user.userRole === 'ROLE_ORGANIZER' && (
                <>
                  <Button variant="outline" size="sm" icon={<FileText size={16} />}>
                    Documents
                  </Button>
                  <Button variant="outline" size="sm" icon={<CheckCircle size={16} />} onClick={() => handleVerifyUser(user.id, user.isVerified)}>
                    {user.isVerified === true ? 'Unverify' : 'Verify'}
                  </Button>
                </>
              )}
              {user.userRole !== 'ROLE_ADMIN' && (
                <Button variant="outline" size="sm" icon={<UserX size={16} />}>
                  Deactivate
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>
          <Users size={24} />
          User Management
        </h2>
        <p>Manage all users on the platform</p>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const userCount = users.filter(user => user.userRole === tab.role).length;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={20} />
              {tab.label} ({userCount})
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading users...</div>
      ) : (
        renderUserTable()
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="user-details">
                <div className="user-avatar-large">
                  {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                </div>
                <div className="user-role-badge">
                  <span className={`role-badge ${getRoleBadgeClass(selectedUser.userRole)}`}>
                    {getRoleDisplayName(selectedUser.userRole)}
                  </span>
                </div>
                <div className="details-grid">
                  {renderUserDetails(selectedUser).map((detail, index) => {
                    const Icon = detail.icon;
                    return (
                      <div key={index} className="detail-item">
                        <div className="detail-label">
                          <Icon size={16} />
                          {detail.label}
                        </div>
                        <div className="detail-value">{detail.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;