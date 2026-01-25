import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, 
  FileText, CheckCircle, XCircle, 
  Clock, Eye, Download, Upload,
  Calendar, Building, Award
} from 'lucide-react';
import './OrganizerVerification.css';

const OrganizerVerification = () => {
  const [organizers, setOrganizers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      status: 'pending',
      avatar: '/api/placeholder/150/150',
      joinDate: '2024-01-15',
      eventsOrganized: 12,
      documents: [
        { name: 'Business License', type: 'pdf', verified: true, uploadDate: '2024-01-16' },
        { name: 'Tax Certificate', type: 'pdf', verified: false, uploadDate: '2024-01-16' },
        { name: 'Insurance Document', type: 'pdf', verified: true, uploadDate: '2024-01-17' }
      ],
      verificationSteps: [
        { step: 'Application Submitted', completed: true, date: '2024-01-15', description: 'Initial application received' },
        { step: 'Documents Uploaded', completed: true, date: '2024-01-16', description: 'All required documents submitted' },
        { step: 'Initial Review', completed: true, date: '2024-01-17', description: 'Documents under review' },
        { step: 'Background Check', completed: false, date: null, description: 'Pending background verification' },
        { step: 'Final Approval', completed: false, date: null, description: 'Awaiting final approval' }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@musicevents.com',
      phone: '+1 (555) 987-6543',
      company: 'Music Events Ltd.',
      location: 'Austin, TX',
      status: 'verified',
      avatar: '/api/placeholder/150/150',
      joinDate: '2024-01-10',
      eventsOrganized: 25,
      documents: [
        { name: 'Business License', type: 'pdf', verified: true, uploadDate: '2024-01-11' },
        { name: 'Tax Certificate', type: 'pdf', verified: true, uploadDate: '2024-01-11' },
        { name: 'Insurance Document', type: 'pdf', verified: true, uploadDate: '2024-01-12' }
      ],
      verificationSteps: [
        { step: 'Application Submitted', completed: true, date: '2024-01-10', description: 'Initial application received' },
        { step: 'Documents Uploaded', completed: true, date: '2024-01-11', description: 'All required documents submitted' },
        { step: 'Initial Review', completed: true, date: '2024-01-12', description: 'Documents reviewed and approved' },
        { step: 'Background Check', completed: true, date: '2024-01-14', description: 'Background check completed' },
        { step: 'Final Approval', completed: true, date: '2024-01-15', description: 'Organizer verified successfully' }
      ]
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael@foodfest.com',
      phone: '+1 (555) 456-7890',
      company: 'Food Festival Co.',
      location: 'New York, NY',
      status: 'rejected',
      avatar: '/api/placeholder/150/150',
      joinDate: '2024-01-20',
      eventsOrganized: 3,
      documents: [
        { name: 'Business License', type: 'pdf', verified: false, uploadDate: '2024-01-21' },
        { name: 'Tax Certificate', type: 'pdf', verified: false, uploadDate: '2024-01-21' },
        { name: 'Insurance Document', type: 'pdf', verified: false, uploadDate: '2024-01-22' }
      ],
      verificationSteps: [
        { step: 'Application Submitted', completed: true, date: '2024-01-20', description: 'Initial application received' },
        { step: 'Documents Uploaded', completed: true, date: '2024-01-21', description: 'Documents submitted for review' },
        { step: 'Initial Review', completed: true, date: '2024-01-22', description: 'Documents rejected - incomplete' },
        { step: 'Background Check', completed: false, date: null, description: 'Not initiated' },
        { step: 'Final Approval', completed: false, date: null, description: 'Application rejected' }
      ]
    }
  ]);

  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleVerify = (organizer) => {
    setActionType('verify');
    setSelectedOrganizer(organizer);
    setShowModal(true);
  };

  const handleReject = (organizer) => {
    setActionType('reject');
    setSelectedOrganizer(organizer);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (selectedOrganizer) {
      setOrganizers(prev => prev.map(organizer => 
        organizer.id === selectedOrganizer.id 
          ? { 
              ...organizer, 
              status: actionType === 'verify' ? 'verified' : 'rejected',
              verificationSteps: actionType === 'verify' 
                ? organizer.verificationSteps.map(step => ({ 
                    ...step, 
                    completed: true, 
                    date: step.date || new Date().toISOString().split('T')[0] 
                  }))
                : organizer.verificationSteps
            }
          : organizer
      ));
    }
    setShowModal(false);
    setSelectedOrganizer(null);
    setRejectionReason('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStepIcon = (completed, isActive = false) => {
    if (completed) {
      return <CheckCircle size={20} className="text-green-500" />;
    } else if (isActive) {
      return <Clock size={20} className="text-blue-500 animate-pulse" />;
    } else {
      return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getCompletedSteps = (steps) => {
    return steps.filter(step => step.completed).length;
  };

  return (
    <div className="organizer-verification-container">
      <motion.div 
        className="verification-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Organizer Verification</h1>
        <p>Review and verify event organizer applications</p>
      </motion.div>

      <div className="organizers-grid">
        {organizers.map((organizer, index) => {
          const completedSteps = getCompletedSteps(organizer.verificationSteps);
          const totalSteps = organizer.verificationSteps.length;
          const progressPercentage = (completedSteps / totalSteps) * 100;
          
          return (
            <motion.div
              key={organizer.id}
              className="organizer-card"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.15, 
                duration: 0.5,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Profile Section */}
              <div className="organizer-profile">
                <motion.div 
                  className="avatar-container"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img src={organizer.avatar} alt={organizer.name} />
                  <motion.div 
                    className="avatar-overlay"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Eye size={24} />
                  </motion.div>
                  <div className="avatar-blur-bg" />
                </motion.div>
                
                <div className="profile-info">
                  <h3>{organizer.name}</h3>
                  <p className="company">{organizer.company}</p>
                  <motion.div 
                    className={`status-badge ${getStatusColor(organizer.status)}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {organizer.status}
                  </motion.div>
                </div>
              </div>

              {/* Stats */}
              <div className="organizer-stats">
                <div className="stat-item">
                  <Calendar size={16} />
                  <span>Joined {new Date(organizer.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="stat-item">
                  <Award size={16} />
                  <span>{organizer.eventsOrganized} Events</span>
                </div>
                <div className="stat-item">
                  <MapPin size={16} />
                  <span>{organizer.location}</span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="contact-details">
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{organizer.email}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{organizer.phone}</span>
                </div>
              </div>

              {/* Documents */}
              <div className="documents-section">
                <h4>Documents ({organizer.documents.filter(d => d.verified).length}/{organizer.documents.length} verified)</h4>
                <div className="documents-list">
                  {organizer.documents.map((doc, idx) => (
                    <motion.div 
                      key={idx} 
                      className="document-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + idx * 0.05 }}
                      whileHover={{ x: 5, backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                    >
                      <FileText size={16} />
                      <div className="doc-info">
                        <span className="doc-name">{doc.name}</span>
                        <span className="doc-date">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + idx * 0.05 + 0.2 }}
                      >
                        {doc.verified ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Verification Timeline */}
              <div className="verification-timeline">
                <div className="timeline-header">
                  <h4>Verification Progress</h4>
                  <div className="progress-indicator">
                    <span>{completedSteps}/{totalSteps}</span>
                    <div className="progress-bar">
                      <motion.div 
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ delay: index * 0.2, duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="timeline-steps">
                  {organizer.verificationSteps.map((step, idx) => {
                    const isActive = !step.completed && idx === completedSteps;
                    return (
                      <motion.div
                        key={idx}
                        className={`timeline-step ${
                          step.completed ? 'completed' : isActive ? 'active' : 'pending'
                        }`}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.1 + idx * 0.1,
                          type: 'spring',
                          stiffness: 100
                        }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="step-connector" />
                        <motion.div 
                          className="step-icon"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {getStepIcon(step.completed, isActive)}
                        </motion.div>
                        <div className="step-content">
                          <span className="step-title">{step.step}</span>
                          <span className="step-description">{step.description}</span>
                          {step.date && (
                            <span className="step-date">{new Date(step.date).toLocaleDateString()}</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="organizer-actions">
                {organizer.status === 'pending' && (
                  <>
                    <motion.button
                      className="action-btn verify"
                      onClick={() => handleVerify(organizer)}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <CheckCircle size={16} />
                      Verify
                    </motion.button>
                    <motion.button
                      className="action-btn reject"
                      onClick={() => handleReject(organizer)}
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <XCircle size={16} />
                      Reject
                    </motion.button>
                  </>
                )}
                <motion.button
                  className="action-btn view"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye size={16} />
                  View Details
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Modal */}
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
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 25 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                {actionType === 'verify' ? 'Verify Organizer' : 'Reject Application'}
              </h3>
              
              <div className="modal-organizer-info">
                <motion.img 
                  src={selectedOrganizer?.avatar} 
                  alt={selectedOrganizer?.name}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
                <div>
                  <h4>{selectedOrganizer?.name}</h4>
                  <p>{selectedOrganizer?.company}</p>
                  <span className="location">{selectedOrganizer?.location}</span>
                </div>
              </div>

              {actionType === 'reject' && (
                <motion.div 
                  className="rejection-reason"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.2 }}
                >
                  <label>Reason for rejection:</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a detailed reason for rejection..."
                    rows={4}
                  />
                </motion.div>
              )}

              <div className="modal-actions">
                <motion.button 
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  className={`btn-primary ${actionType}`}
                  onClick={confirmAction}
                  disabled={actionType === 'reject' && !rejectionReason.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {actionType === 'verify' ? 'Verify Organizer' : 'Reject Application'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganizerVerification;