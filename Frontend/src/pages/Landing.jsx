import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Ticket, TrendingUp, ArrowRight, Star } from 'lucide-react';
import Button from '../components/Button';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calendar size={40} />,
      title: 'Discover Events',
      description: 'Browse thousands of events across multiple categories and locations'
    },
    {
      icon: <Ticket size={40} />,
      title: 'Easy Booking',
      description: 'Book tickets instantly with our seamless booking experience'
    },
    {
      icon: <Users size={40} />,
      title: 'Organize Events',
      description: 'Create and manage your own events with powerful organizer tools'
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Track Analytics',
      description: 'Get detailed insights and analytics for your events'
    }
  ];

  const categories = [
    { name: 'Technology', count: 150, color: '#6366f1' },
    { name: 'Music', count: 230, color: '#ec4899' },
    { name: 'Sports', count: 180, color: '#10b981' },
    { name: 'Food', count: 120, color: '#f59e0b' },
    { name: 'Art', count: 95, color: '#8b5cf6' },
    { name: 'Business', count: 140, color: '#ef4444' }
  ];

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content slide-up">
            <h1>
              The Unified Event
              <span className="gradient-text"> Experience</span>
            </h1>
            <p className="hero-subtitle">
              Discover, book, and manage events all in one place. 
              Join thousands of event enthusiasts and organizers worldwide.
            </p>
            <div className="hero-actions">
              <Button size="lg" onClick={() => navigate('/events')}>
                Explore Events <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <h3>10K+</h3>
                <p>Events</p>
              </div>
              <div className="stat">
                <h3>50K+</h3>
                <p>Users</p>
              </div>
              <div className="stat">
                <h3>500+</h3>
                <p>Organizers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose PlanNGo?</h2>
            <p>Everything you need for the perfect event experience</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Explore by Category</h2>
            <p>Find events that match your interests</p>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="category-card"
                style={{ '--category-color': category.color }}
                onClick={() => navigate(`/events?category=${category.name.toLowerCase()}`)}
              >
                <h3>{category.name}</h3>
                <p>{category.count} Events</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join PlanNGo today and experience events like never before</p>
            <Button size="lg" onClick={() => navigate('/signup')}>
              Create Free Account <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>PlanNGo</h3>
              <p>The unified event experience platform</p>
              <div className="footer-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
                <span>4.9/5 from 2,500+ reviews</span>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="/events">Browse Events</a>
              <a href="/login">Login</a>
              <a href="/signup">Sign Up</a>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="/contact">Contact Us</a>
              <a href="/about">About Us</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 PlanNGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
