import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, 
  FileText, CheckCircle, XCircle, 
  Clock, Eye, Download, Upload
} from 'lucide-react';
import './OrganizerVerification.css';

const OrganizerVerification = () => {
  const [organizers, setOrganizers] = useState([
    {
      id: 1,
      name: 'Suchit Sawant',
      email: 'suchitsawant@gmail.com',
      phone: '7700990265',
      company: 'TechCorp Inc.',
      location: 'Kharghar, Mumbai',
      status: 'pending',
      avatar: 'https://via.placeholder.com/150x150/6366f1/ffffff?text=SS',
      documents: [
        { name: 'Business License', type: 'pdf', verified: true },
        { name: 'Tax Certificate', type: 'pdf', verified: false },
        { name: 'Insurance Document', type: 'pdf', verified: true }
      ],
      verificationSteps: [
        { step: 'Application Submitted', completed: true, date: '2024-01-15' },
        { step: 'Documents Uploaded', completed: true, date: '2024-01-16' },
        { step: 'Initial Review', completed: true, date: '2024-01-17' },
        { step: 'Background Check', completed: false, date: null },
        { step: 'Final Approval', completed: false, date: null }
      ]
    },
    {
      id: 2,
      name: 'Himanshu Samrit',
      email: 'himanshusamrit83@gmail.com',
      phone: '7020911420',
      company: 'Music Events Ltd.',
      location: 'Nagpur',
      status: 'verified',
      avatar: 'https://via.placeholder.com/150x150/ec4899/ffffff?text=HS',
      documents: [
        { name: 'Business License', type: 'pdf', verified: true },
        { name: 'Tax Certificate', type: 'pdf', verified: true },
        { name: 'Insurance Document', type: 'pdf', verified: true }
      ],
      verificationSteps: [
        { step: 'Application Submitted', completed: true, date: '2024-01-10' },
        { step: 'Documents Uploaded', completed: true, date: '2024-01-11' },
        { step: 'Initial Review', completed: true, date: '2024-01-12' },
        { step: 'Background Check', completed: true, date: '2024-01-14' },
        { step: 'Final Approval', completed: true, date: '2024-01-15' }
      ]
    }
  ]);

  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleVerify = (organizerId) => {
    setActionType('verify');
    setSelectedOrganizer(organizers.find(o => o.id === organizerId));
    setShowModal(true);
  };

  const handleReject = (organizerId) => {
    setActionType('reject');
    setSelectedOrganizer(organizers.find(o => o.id === organizerId));
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
                ? organizer.verificationSteps.map(step => ({ ...step, completed: true, date: step.date || new Date().toISOString().split('T')[0] }))
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
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'verified': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStepIcon = (completed) => {
    return completed ? (
      <CheckCircle size={20} className="text-green-500" />
    ) : (
      <Clock size={20} className="text-gray-400" />
    );
  };

  return (
    <div className="organizer-verification-container">
      <div className="verification-header">
        <h1>Organizer Verification</h1>
        <p>Review and verify event organizer applications</p>
      </div>

      <div className="organizers-grid">
        {organizers.map((organizer, index) => (
          <motion.div
            key={organizer.id}
            className="organizer-card glassmorphism"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            {/* Profile Section */}
            <div className="organizer-profile">
              <motion.div 
                className="avatar-container"
                whileHover={{ scale: 1.1 }}
              >
                <img src={organizer.avatar} alt={organizer.name} />
                <div className="avatar-overlay">
                  <Eye size={24} />
                </div>
              </motion.div>
              
              <div className="profile-info">
                <h3>{organizer.name}</h3>
                <p className="company">{organizer.company}</p>
                <div className={`status-badge ${getStatusColor(organizer.status)}`}>
                  {organizer.status}
                </div>
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
              <div className="detail-item">
                <MapPin size={16} />
                <span>{organizer.location}</span>
              </div>
            </div>

            {/* Documents */}
            <div className="documents-section">
              <h4>Documents</h4>
              <div className="documents-list">
                {organizer.documents.map((doc, idx) => (
                  <div key={idx} className="document-item">
                    <FileText size={16} />
                    <span>{doc.name}</span>
                    {doc.verified ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <XCircle size={16} className="text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Timeline */}
            <div className="verification-timeline">
              <h4>Verification Progress</h4>
              <div className="timeline-steps">
                {organizer.verificationSteps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    className={`timeline-step ${step.completed ? 'completed' : 'pending'}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="step-icon">
                      {getStepIcon(step.completed)}
                    </div>
                    <div className="step-content">
                      <span className="step-title">{step.step}</span>
                      {step.date && (
                        <span className="step-date">{step.date}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="organizer-actions">
              {organizer.status === 'pending' && (
                <>
                  <motion.button
                    className="action-btn verify"
                    onClick={() => handleVerify(organizer.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle size={16} />
                    Verify
                  </motion.button>
                  <motion.button
                    className="action-btn reject"
                    onClick={() => handleReject(organizer.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
        ))}
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
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                {actionType === 'verify' ? 'Verify Organizer' : 'Reject Application'}
              </h3>
              
              <div className="modal-organizer-info">
                <img src={selectedOrganizer?.avatar} alt={selectedOrganizer?.name} />
                <div>
                  <h4>{selectedOrganizer?.name}</h4>
                  <p>{selectedOrganizer?.company}</p>
                </div>
              </div>

              {actionType === 'reject' && (
                <div className="rejection-reason">
                  <label>Reason for rejection:</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    rows={4}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={`btn-primary ${actionType}`}
                  onClick={confirmAction}
                  disabled={actionType === 'reject' && !rejectionReason.trim()}
                >
                  {actionType === 'verify' ? 'Verify' : 'Reject'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganizerVerification;