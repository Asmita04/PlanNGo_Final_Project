import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, Music, Briefcase, 
  Heart, Gamepad2, Camera, BookOpen,
  Clock, MapPin, DollarSign, Copy
} from 'lucide-react';
import './EventTemplates.css';

const EventTemplates = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = [
    {
      id: 1,
      name: 'Conference Template',
      category: 'business',
      icon: Briefcase,
      color: 'blue',
      description: 'Professional conference with networking sessions',
      duration: '8 hours',
      capacity: 200,
      price: 299,
      features: ['Registration desk', 'Networking breaks', 'Speaker sessions', 'Q&A panels'],
      schedule: [
        { time: '09:00', activity: 'Registration & Welcome Coffee' },
        { time: '10:00', activity: 'Opening Keynote' },
        { time: '11:30', activity: 'Panel Discussion' },
        { time: '13:00', activity: 'Networking Lunch' },
        { time: '14:30', activity: 'Breakout Sessions' },
        { time: '16:00', activity: 'Closing Remarks' }
      ]
    },
    {
      id: 2,
      name: 'Music Concert',
      category: 'entertainment',
      icon: Music,
      color: 'purple',
      description: 'Live music performance with multiple artists',
      duration: '4 hours',
      capacity: 1000,
      price: 89,
      features: ['Sound system', 'Stage lighting', 'Security', 'Merchandise booth'],
      schedule: [
        { time: '19:00', activity: 'Doors Open' },
        { time: '20:00', activity: 'Opening Act' },
        { time: '21:00', activity: 'Main Performance' },
        { time: '22:30', activity: 'Encore' }
      ]
    },
    {
      id: 3,
      name: 'Wedding Celebration',
      category: 'social',
      icon: Heart,
      color: 'pink',
      description: 'Complete wedding ceremony and reception',
      duration: '6 hours',
      capacity: 150,
      price: 199,
      features: ['Ceremony setup', 'Reception dinner', 'Photography', 'Music & DJ'],
      schedule: [
        { time: '15:00', activity: 'Guest Arrival' },
        { time: '15:30', activity: 'Ceremony' },
        { time: '16:30', activity: 'Cocktail Hour' },
        { time: '18:00', activity: 'Reception Dinner' },
        { time: '20:00', activity: 'Dancing & Entertainment' }
      ]
    },
    {
      id: 4,
      name: 'Gaming Tournament',
      category: 'entertainment',
      icon: Gamepad2,
      color: 'green',
      description: 'Competitive gaming event with prizes',
      duration: '12 hours',
      capacity: 64,
      price: 49,
      features: ['Gaming stations', 'Live streaming', 'Prize pool', 'Food & drinks'],
      schedule: [
        { time: '09:00', activity: 'Registration' },
        { time: '10:00', activity: 'Qualifying Rounds' },
        { time: '14:00', activity: 'Lunch Break' },
        { time: '15:00', activity: 'Semi-finals' },
        { time: '18:00', activity: 'Finals' },
        { time: '20:00', activity: 'Award Ceremony' }
      ]
    },
    {
      id: 5,
      name: 'Workshop Series',
      category: 'education',
      icon: BookOpen,
      color: 'orange',
      description: 'Educational workshop with hands-on activities',
      duration: '3 hours',
      capacity: 30,
      price: 79,
      features: ['Materials included', 'Certificate', 'Take-home kit', 'Expert instructor'],
      schedule: [
        { time: '10:00', activity: 'Introduction & Setup' },
        { time: '10:30', activity: 'Theory Session' },
        { time: '11:30', activity: 'Hands-on Practice' },
        { time: '12:30', activity: 'Q&A & Wrap-up' }
      ]
    },
    {
      id: 6,
      name: 'Photography Exhibition',
      category: 'art',
      icon: Camera,
      color: 'indigo',
      description: 'Art exhibition with photographer meet & greet',
      duration: '5 hours',
      capacity: 100,
      price: 25,
      features: ['Gallery space', 'Artist talk', 'Refreshments', 'Catalog'],
      schedule: [
        { time: '14:00', activity: 'Exhibition Opens' },
        { time: '15:30', activity: 'Artist Talk' },
        { time: '16:30', activity: 'Meet & Greet' },
        { time: '18:00', activity: 'Closing Reception' }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: Calendar },
    { id: 'business', name: 'Business', icon: Briefcase },
    { id: 'entertainment', name: 'Entertainment', icon: Music },
    { id: 'social', name: 'Social', icon: Heart },
    { id: 'education', name: 'Education', icon: BookOpen },
    { id: 'art', name: 'Art & Culture', icon: Camera }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  return (
    <div className="event-templates">
      <div className="templates-header">
        <h2>Choose an Event Template</h2>
        <p>Start with a pre-designed template and customize it to your needs</p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={20} />
              <span>{category.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="templates-grid">
        {filteredTemplates.map((template, index) => {
          const Icon = template.icon;
          return (
            <motion.div
              key={template.id}
              className={`template-card ${template.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="template-header">
                <div className="template-icon">
                  <Icon size={24} />
                </div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
              </div>

              <div className="template-details">
                <div className="detail-row">
                  <Clock size={16} />
                  <span>{template.duration}</span>
                </div>
                <div className="detail-row">
                  <Users size={16} />
                  <span>{template.capacity} attendees</span>
                </div>
                <div className="detail-row">
                  <DollarSign size={16} />
                  <span>${template.price}</span>
                </div>
              </div>

              <div className="template-features">
                <h4>Included Features:</h4>
                <ul>
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                  {template.features.length > 3 && (
                    <li>+{template.features.length - 3} more</li>
                  )}
                </ul>
              </div>

              <div className="template-schedule">
                <h4>Sample Schedule:</h4>
                <div className="schedule-preview">
                  {template.schedule.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="schedule-item">
                      <span className="time">{item.time}</span>
                      <span className="activity">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="template-actions">
                <motion.button
                  className="preview-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Preview
                </motion.button>
                <motion.button
                  className="use-template-btn"
                  onClick={() => handleUseTemplate(template)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy size={16} />
                  Use Template
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EventTemplates;