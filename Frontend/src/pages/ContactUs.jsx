import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, User, FileText, MessageSquare } from 'lucide-react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
      alert('Thank you for your message! We\'ll get back to you soon.');
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Get In Touch</h1>
            <p className="hero-subtitle">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-content">
        <div className="container">
          <div className={`contact-grid ${isVisible ? 'visible' : ''}`}>
            {/* Contact Information */}
            <div className="contact-info-section">
              <div className="section-header">
                <h2>Contact Information</h2>
                <p>Feel free to reach out to us through any of these channels</p>
              </div>

              <div className="info-cards">
                <div className="info-card">
                  <div className="card-icon">
                    <Mail size={24} />
                  </div>
                  <div className="card-content">
                    <h3>Email Us</h3>
                    <p>support@planngo.com</p>
                    <a href="mailto:support@planngo.com" className="card-link">
                      Send Email →
                    </a>
                  </div>
                </div>

                <div className="info-card">
                  <div className="card-icon">
                    <Phone size={24} />
                  </div>
                  <div className="card-content">
                    <h3>Call Us</h3>
                    <p>+1 (555) 123-4567</p>
                    <a href="tel:+15551234567" className="card-link">
                      Make a Call →
                    </a>
                  </div>
                </div>

                <div className="info-card">
                  <div className="card-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="card-content">
                    <h3>Visit Us</h3>
                    <p>Andheri West, Mumbai – 400053</p>
                    <p className="address-detail">Maharashtra, India</p>
                    <a href="#" className="card-link">
                      Get Directions →
                    </a>
                  </div>
                </div>
              </div>

              <div className="business-hours">
                <h3>Business Hours</h3>
                <div className="hours-list">
                  <div className="hours-item">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-header">
                  <h2>Send us a Message</h2>
                  <p>Fill out the form below and we'll get back to you shortly</p>
                </div>

                <div className="form-fields">
                  <div className={`form-group ${focusedField === 'name' ? 'focused' : ''} ${formData.name ? 'filled' : ''}`}>
                    <label htmlFor="name">Full Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField('')}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${formData.email ? 'filled' : ''}`}>
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className={`form-group ${focusedField === 'subject' ? 'focused' : ''} ${formData.subject ? 'filled' : ''}`}>
                    <label htmlFor="subject">Subject</label>
                    <div className="input-wrapper">
                      <FileText className="input-icon" size={18} />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField('')}
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                  </div>

                  <div className={`form-group textarea-group ${focusedField === 'message' ? 'focused' : ''} ${formData.message ? 'filled' : ''}`}>
                    <label htmlFor="message">Message</label>
                    <div className="input-wrapper">
                      <MessageSquare className="input-icon" size={18} />
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Tell us more about your inquiry..."
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  <span className="button-text">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </span>
                  <Send size={20} className="button-icon" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;