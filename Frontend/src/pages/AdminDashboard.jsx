import { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle, Clock, 
  TrendingUp, BarChart3, PieChart, Activity,
  ArrowUp, ArrowDown, Eye, Filter, DollarSign, XCircle, MapPin, Plus, Users, Settings
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart as RechartsPie, Cell, Area, AreaChart, Pie, Legend
} from 'recharts';
import { api } from '../services';
import Button from '../components/Button';

import EventManagement from './EventManagement';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    categoryData: []
  });
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usersData = await api.getAllUsers();
      setUsers(usersData);
      
      const eventsData = await api.getAllEvents();
      setEvents(eventsData);
      
      // Update analytics based on fetched data
      setAnalytics(prev => ({
        ...prev,
        totalUsers: usersData.length,
        totalEvents: eventsData.length
      }));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const statCards = [
    {
      title: 'Total Users',
      value: analytics.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      trend: 'up',
      change: '+12%'
    },
    {
      title: 'Total Events',
      value: analytics.totalEvents,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      trend: 'up',
      change: '+8%'
    },
    {
      title: 'Total Bookings',
      value: analytics.totalBookings,
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      trend: 'up',
      change: '+15%'
    },
    {
      title: 'Total Revenue',
      value: `₹${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600',
      trend: 'up',
      change: '+20%'
    }
  ];

  const chartData = [
    { name: 'Jan', events: 12, bookings: 45 },
    { name: 'Feb', events: 19, bookings: 52 },
    { name: 'Mar', events: 15, bookings: 61 },
    { name: 'Apr', events: 22, bookings: 58 },
    { name: 'May', events: 18, bookings: 70 },
    { name: 'Jun', events: 25, bookings: 85 }
  ];

  const pieData = analytics.categoryData.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 6]
  }));

  const renderTabContent = () => {
    switch (activeTab) {

      case 'events':
        return <EventManagement />;
      case 'settings':
        return (
          <div className="settings-section">
            <h3>System Settings</h3>
            <p>Configure system-wide settings and preferences.</p>
          </div>
        );

      case 'overview':
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="stat-card">
                    <div className="stat-card-content">
                      <div className="stat-header">
                        <div className={`stat-icon bg-gradient-to-r ${card.color}`}>
                          <Icon size={24} />
                        </div>
                        <div className="stat-trend">
                          {card.trend === 'up' ? (
                            <ArrowUp size={16} className="text-green-500" />
                          ) : (
                            <ArrowDown size={16} className="text-red-500" />
                          )}
                          <span className={card.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                            {card.change}
                          </span>
                        </div>
                      </div>
                      <div className="stat-info">
                        <p>{card.title}</p>
                        <h3>{card.value}</h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Events & Bookings Trend</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="events" 
                      stroke="#6366f1" 
                      fillOpacity={1} 
                      fill="url(#colorEvents)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>Event Categories</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Events */}
            <div className="recent-section">
              <div className="section-header">
                <h3>Recent Events</h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <div className="events-table">
                <div className="table-header">
                  <span>Event</span>
                  <span>Venue</span>
                  <span>Date</span>
                  <span>Status</span>
                </div>
                {events.slice(0, 5).map((event, index) => (
                  <div key={index} className="table-row">
                    <div className="event-info">
                      <img src={event.eventImage || '/default-event.jpg'} alt={event.title} />
                      <div>
                        <h4>{event.title}</h4>
                        <p>{event.category}</p>
                      </div>
                    </div>
                    <span>{event.venue?.venueName || 'N/A'}</span>
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    <span className={`status ${event.isApproved ? 'approved' : 'pending'}`}>
                      {event.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your platform, users, events, and venues.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;