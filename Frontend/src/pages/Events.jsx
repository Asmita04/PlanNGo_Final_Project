import { useState, useEffect } from 'react';
import { Search, Filter, Loader } from 'lucide-react';
import { api } from '../services';
import EventCard from '../components/EventCard';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    date: '',
    priceRange: [0, 1000]
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', 'Technology', 'Music', 'Sports', 'Food', 'Art', 'Business'];

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, events]);

  const loadEvents = async () => {
    try {
      const data = await api.getAllEvents();
      // Filter out expired events
      const currentDate = new Date();
      const activeEvents = data.filter(event => {
        const eventDate = new Date(event.startDate || event.date);
        return eventDate >= currentDate;
      });
      setEvents(activeEvents);
      setFilteredEvents(activeEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(e =>
        e.title?.toLowerCase().includes(search) ||
        e.description?.toLowerCase().includes(search) ||
        (e.location || e.venueName)?.toLowerCase().includes(search)
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(e => e.category === filters.category);
    }

    if (filters.date) {
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.startDate || e.date).toISOString().split('T')[0];
        return eventDate === filters.date;
      });
    }

    filtered = filtered.filter(e => {
      const price = e.ticketPrice || e.price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    setFilteredEvents(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="spinner" size={48} />
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="container">
        <div className="events-header">
          <div>
            <h1>Discover Events</h1>
            <p>Find and book amazing events near you</p>
          </div>
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={20} />
            Filters
          </button>
        </div>

        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search events by name, location, or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className={`filters-panel ${showFilters ? 'active' : ''}`}>
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
            />
          </div>

          <button
            className="reset-filters"
            onClick={() => setFilters({ search: '', category: 'all', date: '', priceRange: [0, 1000] })}
          >
            Reset Filters
          </button>
        </div>

        <div className="events-results">
          <p className="results-count">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
          </p>

          {filteredEvents.length === 0 ? (
            <div className="no-results">
              <h3>No events found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map(event => (
                <EventCard key={event.eventId || event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
