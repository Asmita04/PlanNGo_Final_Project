import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { api } from '../services';
import './EventManagement.css';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsData = await api.getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'approved' && event.isApproved) ||
      (filterStatus === 'pending' && !event.isApproved);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="event-management">
      <div className="section-header">
        <h2>
          <Calendar size={32} />
          Event Management
        </h2>
        <p>Manage all events in the system</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-dropdown">
          <Filter size={20} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Events</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="events-table">
        <div className="table-header">
          <div>Event Name</div>
          <div>Venue</div>
          <div>Date</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {loading ? (
          <div className="loading-state">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <Calendar size={64} />
            <h3>No events found</h3>
            <p>No events match your search criteria</p>
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <div key={index} className="table-row">
              <div className="event-info">
                <h4>{event.title}</h4>
                <p>{event.category}</p>
              </div>
              <div className="venue-info">
                <span>{event.venue?.venueName || 'N/A'}</span>
              </div>
              <div>{new Date(event.startDate).toLocaleDateString()}</div>
              <div>
                <span className={`status-badge status-${event.isApproved ? 'approved' : 'pending'}`}>
                  {event.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div className="actions">
                <button className="action-btn view">
                  <Eye size={16} />
                </button>
                <button className="action-btn edit">
                  <Edit size={16} />
                </button>
                <button className="action-btn delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventManagement;