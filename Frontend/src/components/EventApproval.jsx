import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Clock, 
  CheckCircle, XCircle, Eye, Filter,
  Search, MoreHorizontal, X, Check
} from 'lucide-react';
import './EventApproval.css';

const EventApproval = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Tech Conference 2024',
      organizer: 'TechCorp Inc.',
      date: '2024-03-15',
      location: 'San Francisco, CA',
      category: 'Technology',
      capacity: 500,
      status: 'pending',
      image: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=Tech+Conference',
      description: 'Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing. Join industry leaders and innovators for three days of networking, learning, and collaboration.',
      price: 299,
      duration: '3 days'
    },
    {
      id: 2,
      title: 'Summer Music Festival',
      organizer: 'Music Events Ltd.',
      date: '2024-06-20',
      location: 'Austin, TX',
      category: 'Music',
      capacity: 2000,
      status: 'pending',
      image: 'https://via.placeholder.com/300x200/ec4899/ffffff?text=Music+Festival',
      description: 'Three-day music festival featuring top artists from around the world. Experience live performances, food trucks, and an unforgettable atmosphere.',
      price: 149,
      duration: '3 days'
    },
    {
      id: 3,
      title: 'Food & Wine Expo',
      organizer: 'Culinary World',
      date: '2024-04-10',
      location: 'New York, NY',
      category: 'Food',
      capacity: 800,
      status: 'approved',
      image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Food+Expo',
      description: 'Gourmet food and wine tasting experience with renowned chefs and sommeliers. Discover new flavors and culinary techniques.',
      price: 89,
      duration: '1 day'
    },
    {
      id: 4,
      title: 'Startup Pitch Competition',
      organizer: 'Innovation Hub',
      date: '2024-05-05',
      location: 'Seattle, WA',
      category: 'Business',
      capacity: 300,
      status: 'rejected',
      image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Startup+Pitch',
      description: 'Watch emerging startups pitch their innovative ideas to a panel of investors and industry experts.',
      price: 25,
      duration: '4 hours'
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [toast, setToast] = useState(null);

  const handleApprove = (event) => {
    setActionType('approve');
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleReject = (event) => {
    setActionType('reject');
    setSelectedEvent(event);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (selectedEvent) {
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, status: actionType === 'approve' ? 'approved' : 'rejected' }
          : event
      ));
      
      // Show toast notification
      setToast({
        type: actionType === 'approve' ? 'success' : 'error',
        message: `Event ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`
      });
      
      setTimeout(() => setToast(null), 3000);
    }
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handlePreview = (event) => {
    setPreviewEvent(event);
    setShowPreview(true);
  };

  const toggleRowExpand = (eventId) => {
    setExpandedRow(expandedRow === eventId ? null : eventId);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="event-approval-container">
      {/* Header */}
      <motion.div 
        className="approval-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>Event Approval System</h1>
          <p>Review and manage event submissions</p>
        </div>
        
        <div className="header-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </motion.div>

      {/* Events Table */}
      <motion.div 
        className="events-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="table-header">
          <div className="table-row header-row">
            <div className="table-cell">Event</div>
            <div className="table-cell">Organizer</div>
            <div className="table-cell">Date</div>
            <div className="table-cell">Category</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Actions</div>
          </div>
        </div>
        
        <div className="table-body">
          <AnimatePresence>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className={`table-row data-row ${expandedRow === event.id ? 'expanded' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                onClick={() => toggleRowExpand(event.id)}
              >
                <div className="table-cell event-cell">
                  <img src={event.image} alt={event.title} />
                  <div>
                    <h4>{event.title}</h4>
                    <p>{event.location}</p>
                  </div>
                </div>
                
                <div className="table-cell">
                  <span className="organizer-name">{event.organizer}</span>
                </div>
                
                <div className="table-cell">
                  <div className="date-info">
                    <Calendar size={16} />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="table-cell">
                  <span className="category-badge">{event.category}</span>
                </div>
                
                <div className="table-cell">
                  <motion.div 
                    className={`status-badge ${getStatusColor(event.status)}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {event.status}
                  </motion.div>
                </div>
                
                <div className="table-cell actions-cell">
                  <div className="action-buttons">
                    {event.status === 'pending' && (
                      <>
                        <motion.button
                          className="action-btn approve"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(event);
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Check size={16} />
                        </motion.button>
                        <motion.button
                          className="action-btn reject"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(event);
                          }}
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <X size={16} />
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      className="action-btn preview"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(event);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye size={16} />
                    </motion.button>
                  </div>
                </div>
                
                {/* Expanded Row Content */}
                <AnimatePresence>
                  {expandedRow === event.id && (
                    <motion.div
                      className="expanded-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="expanded-details">
                        <div className="detail-item">
                          <Users size={16} />
                          <span>Capacity: {event.capacity}</span>
                        </div>
                        <div className="detail-item">
                          <Clock size={16} />
                          <span>Duration: {event.duration}</span>
                        </div>
                        <div className="detail-item">
                          <span>Price: ${event.price}</span>
                        </div>
                      </div>
                      <p className="event-description">{event.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}</h3>
              <p>
                Are you sure you want to {actionType} the event "{selectedEvent?.title}"?
              </p>
              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <motion.button 
                  className={`btn-primary ${actionType}`}
                  onClick={confirmAction}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Drawer */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              className="preview-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="preview-header">
                <h3>Event Preview</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowPreview(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              {previewEvent && (
                <div className="preview-content">
                  <img src={previewEvent.image} alt={previewEvent.title} />
                  <div className="preview-details">
                    <h2>{previewEvent.title}</h2>
                    <p className="organizer">by {previewEvent.organizer}</p>
                    
                    <div className="preview-info">
                      <div className="info-item">
                        <Calendar size={20} />
                        <span>{new Date(previewEvent.date).toLocaleDateString()}</span>
                      </div>
                      <div className="info-item">
                        <MapPin size={20} />
                        <span>{previewEvent.location}</span>
                      </div>
                      <div className="info-item">
                        <Users size={20} />
                        <span>{previewEvent.capacity} capacity</span>
                      </div>
                    </div>
                    
                    <div className="preview-description">
                      <h4>Description</h4>
                      <p>{previewEvent.description}</p>
                    </div>
                    
                    <div className="preview-actions">
                      {previewEvent.status === 'pending' && (
                        <>
                          <motion.button
                            className="preview-btn approve"
                            onClick={() => {
                              setShowPreview(false);
                              handleApprove(previewEvent);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <CheckCircle size={20} />
                            Approve Event
                          </motion.button>
                          <motion.button
                            className="preview-btn reject"
                            onClick={() => {
                              setShowPreview(false);
                              handleReject(previewEvent);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <XCircle size={20} />
                            Reject Event
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast ${toast.type}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventApproval;