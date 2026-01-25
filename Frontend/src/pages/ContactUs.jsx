import { useState, useEffect } from 'react';
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

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <div className="contact-us">
      <div className="contact-hero">
        <div className="hero-bg"></div>
        <div className="container">
          <h1 className="hero-title">Contact Us</h1>
          <p className="hero-subtitle">Get in touch with our team</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="container">
          <div className={`contact-grid ${isVisible ? 'visible' : ''}`}>
            <div className="contact-info">
              <h2 className="info-title">Get in Touch</h2>
              <p className="info-subtitle">Have questions about PlanNGo? We're here to help!</p>
              
              <div className="contact-item item-1">
                <div className="item-icon">📧</div>
                <div className="item-content">
                  <h3>Email</h3>
                  <p>support@planngo.com</p>
                </div>
              </div>
              
              <div className="contact-item item-2">
                <div className="item-icon">📞</div>
                <div className="item-content">
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="contact-item item-3">
                <div className="item-icon">📍</div>
                <div className="item-content">
                  <h3>Address</h3>
                  <p>PlanNgo Technologies Pvt. Ltd.
<br />Andheri West, Mumbai – 400053 <br /> Maharashtra, India</p>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <h2 className="form-title">Send us a Message</h2>
                <div className="form-decoration"></div>
              </div>
              
              <div className={`form-group ${focusedField === 'name' ? 'focused' : ''} ${formData.name ? 'filled' : ''}`}>
                <div className="input-wrapper">
                  <div className="input-icon">👤</div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    required
                  />
                  <label className="floating-label">Your Name</label>
                  <div className="input-border"></div>
                </div>
              </div>
              
              <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${formData.email ? 'filled' : ''}`}>
                <div className="input-wrapper">
                  <div className="input-icon">✉️</div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    required
                  />
                  <label className="floating-label">Your Email</label>
                  <div className="input-border"></div>
                </div>
              </div>
              
              <div className={`form-group ${focusedField === 'subject' ? 'focused' : ''} ${formData.subject ? 'filled' : ''}`}>
                <div className="input-wrapper">
                  <div className="input-icon">📝</div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField('')}
                    required
                  />
                  <label className="floating-label">Subject</label>
                  <div className="input-border"></div>
                </div>
              </div>
              
              <div className={`form-group textarea-group ${focusedField === 'message' ? 'focused' : ''} ${formData.message ? 'filled' : ''}`}>
                <div className="input-wrapper">
                  <div className="input-icon">💬</div>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField('')}
                    required
                  ></textarea>
                  <label className="floating-label">Your Message</label>
                  <div className="input-border"></div>
                </div>
              </div>
              
              <button type="submit" className="submit-btn">
                <div className="btn-content">
                  <span className="btn-text">Send Message</span>
                  <div className="btn-icon">🚀</div>
                </div>
                <div className="btn-ripple"></div>
                <div className="btn-glow"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;