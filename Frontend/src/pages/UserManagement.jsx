import { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = ({ isEmbedded = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/all');
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const endpoint = currentStatus ? 'deactivate' : 'activate';
      await axios.put(`/api/users/${userId}/${endpoint}`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      setError(`Failed to ${currentStatus ? 'deactivate' : 'activate'} user`);
      console.error('Error updating user status:', error);
    }
  };

  const UserCard = ({ user }) => (
    <div className="user-card">
      <div className="user-info">
        <h4 className="user-name">{user.firstName} {user.lastName}</h4>
        <p className="user-email">{user.email}</p>
        <span className={`user-role ${user.userRole?.toLowerCase().replace('role_', '')}`}>
          {user.userRole?.replace('ROLE_', '')}
        </span>
        <span className={`user-status ${user.active ? 'active' : 'inactive'}`}>
          {user.active ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="user-actions">
        <button 
          className={user.active ? 'deactivate-btn' : 'activate-btn'}
          onClick={() => toggleUserStatus(user.id, user.active)}
        >
          {user.active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  const customers = users.filter(user => user.userRole === 'ROLE_CUSTOMER' && user.active);
  const organizers = users.filter(user => user.userRole === 'ROLE_ORGANIZER' && user.active);
  const admins = users.filter(user => user.userRole === 'ROLE_ADMIN' && user.active);
  const inactiveUsers = users.filter(user => !user.active);

  const content = (
    <>
      {error && (
        <div className="error-banner">
          <span>{error}</span>
        </div>
      )}

      <div className="user-sections">
        {/* Customers Section */}
        <div className="user-section">
          <h2 className="section-title">
            <span className="role-icon">👤</span>
            Customers ({customers.length})
          </h2>
          <div className="user-grid">
            {customers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>

        {/* Organizers Section */}
        <div className="user-section">
          <h2 className="section-title">
            <span className="role-icon">🎪</span>
            Organizers ({organizers.length})
          </h2>
          <div className="user-grid">
            {organizers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>

        {/* Admins Section */}
        <div className="user-section">
          <h2 className="section-title">
            <span className="role-icon">⚡</span>
            Admins ({admins.length})
          </h2>
          <div className="user-grid">
            {admins.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>

        {/* Inactive Users Section */}
        <div className="user-section inactive-section">
          <h2 className="section-title">
            <span className="role-icon">🚫</span>
            Inactive Users ({inactiveUsers.length})
          </h2>
          <div className="user-grid">
            {inactiveUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  if (isEmbedded) {
    return <div className="user-management-embedded">{content}</div>;
  }

  return (
    <div className="user-management">
      <div className="user-hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">User Management</h1>
            <p className="hero-subtitle">Manage all users across the platform</p>
          </div>
        </div>
      </div>

      <div className="user-content">
        <div className="container">
          {content}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;