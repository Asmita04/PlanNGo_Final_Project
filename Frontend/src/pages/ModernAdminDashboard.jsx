import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, CheckCircle, Clock, 
  TrendingUp, Bell, Settings, Moon, Sun,
  BarChart3, PieChart, Activity, Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Cell } from 'recharts';
import './AdminDashboard.css';

const ModernAdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New event pending approval', time: '2 min ago', type: 'warning' },
    { id: 2, message: 'Organizer verified successfully', time: '5 min ago', type: 'success' }
  ]);

  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingApprovals: 0,
    verifiedOrganizers: 0,
    activeUsers: 0
  });

  const finalStats = {
    totalEvents: 1250,
    pendingApprovals: 23,
    verifiedOrganizers: 156,
    activeUsers: 8934
  };

  const chartData = [
    { name: 'Jan', events: 65 },
    { name: 'Feb', events: 89 },
    { name: 'Mar', events: 123 },
    { name: 'Apr', events: 156 },
    { name: 'May', events: 178 },
    { name: 'Jun', events: 201 }
  ];

  const pieData = [
    { name: 'Technology', value: 35, color: '#6366f1' },
    { name: 'Music', value: 25, color: '#ec4899' },
    { name: 'Sports', value: 20, color: '#10b981' },
    { name: 'Food', value: 20, color: '#f59e0b' }
  ];

  // Animated counter effect
  useEffect(() => {
    const animateCounters = () => {
      Object.keys(finalStats).forEach(key => {
        let start = 0;
        const end = finalStats[key];
        const duration = 2000;
        const increment = end / (duration / 16);
        
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setStats(prev => ({ ...prev, [key]: end }));
            clearInterval(timer);
          } else {
            setStats(prev => ({ ...prev, [key]: Math.floor(start) }));
          }
        }, 16);
      });
    };

    const timeout = setTimeout(animateCounters, 500);
    return () => clearTimeout(timeout);
  }, []);

  const statCards = [
    { title: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'from-blue-500 to-purple-600', change: '+12%' },
    { title: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, color: 'from-orange-500 to-red-500', change: '+5%' },
    { title: 'Verified Organizers', value: stats.verifiedOrganizers, icon: CheckCircle, color: 'from-green-500 to-teal-500', change: '+8%' },
    { title: 'Active Users', value: stats.activeUsers, icon: Users, color: 'from-purple-500 to-pink-500', change: '+15%' }
  ];

  return (
    <div className={`modern-admin-dashboard ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <motion.div 
        className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <h2>PlanNGo Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item">
            <Calendar size={20} />
            <span>Events</span>
          </a>
          <a href="#" className="nav-item">
            <Users size={20} />
            <span>Organizers</span>
          </a>
          <a href="#" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="notification-bell">
              <Bell size={20} />
              <span className="notification-badge">{notifications.length}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className="stat-card glassmorphism"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className={`stat-icon bg-gradient-to-r ${card.color}`}>
                  <Icon size={24} />
                </div>
                <div className="stat-content">
                  <h3>{card.title}</h3>
                  <p className="stat-number">{card.value.toLocaleString()}</p>
                  <span className="stat-change">{card.change}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <motion.div 
            className="chart-card glassmorphism"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3>Events Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            className="chart-card glassmorphism"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3>Event Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <RechartsPie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Notifications Panel */}
        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.div 
              className="notifications-panel glassmorphism"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3>Recent Notifications</h3>
              {notifications.map(notification => (
                <motion.div 
                  key={notification.id}
                  className={`notification-item ${notification.type}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <p>{notification.message}</p>
                  <span>{notification.time}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernAdminDashboard;