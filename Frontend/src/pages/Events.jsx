import { useState, useEffect } from 'react';
import { Search, Filter, Loader } from 'lucide-react';
import { api } from '../services';
import EventCard from '../components/EventCard';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-white mx-auto mb-4" size={48} />
          <p className="text-white text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Discover Events</h1>
              <p className="text-white/80 text-lg">Find and book amazing events near you</p>
            </div>
            <button 
              className="px-6 py-3 bg-white/20 border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
            <input
              type="text"
              placeholder="Search events by name, location, or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:bg-white/30 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all duration-300"
            />
          </div>
        </div>

        {showFilters && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:bg-white/30 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all duration-300"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-800 text-white">
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">Date</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:bg-white/30 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            <button
              className="mt-6 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              onClick={() => setFilters({ search: '', category: 'all', date: '', priceRange: [0, 1000] })}
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <p className="text-white/80 text-lg mb-6">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
          </p>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-white mb-2">No events found</h3>
              <p className="text-white/60">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
