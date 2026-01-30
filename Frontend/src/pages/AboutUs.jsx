import { useState, useEffect } from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const [visibleCards, setVisibleCards] = useState([]);

  const teamMembers = [
    {
      name: 'Himanshu Samrit',
      role: 'Full Stack Developer',
      avatar: '👨‍💻',
      color: '#667eea'
    },
    {
      name: 'Suchit Sawant',
      role: 'Frontend Developer',
      avatar: '👨‍🎨',
      color: '#764ba2'
    },
    {
      name: 'Asmita Mhetre',
      role: 'UI/UX Designer',
      avatar: '👩‍🎨',
      color: '#f093fb'
    },
    {
      name: 'Niket Malviya',
      role: 'Backend Developer',
      avatar: '👨‍💼',
      color: '#4facfe'
    },
    {
      name: 'Bhushan Dhawan',
      role: 'Project Manager',
      avatar: '👨‍🚀',
      color: '#43e97b'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCards(prev => {
        if (prev.length < teamMembers.length) {
          return [...prev, prev.length];
        }
        return prev;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="about-us">
      <div className="about-hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">About PlanNGo</h1>
            <p className="hero-subtitle">Your trusted partner in event management</p>
          </div>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          <div className="about-section">
            <h2 className="section-title">Our Story</h2>
            <p className="story-text">
              PlanNGo was founded with a simple mission: to make event planning effortless and enjoyable. 
              We understand that organizing events can be overwhelming, which is why we've created a 
              comprehensive platform that handles everything from planning to execution.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-card card-1">
              <div className="card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To simplify event management and help create memorable experiences for everyone.</p>
            </div>
            
            <div className="about-card card-2">
              <div className="card-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>To be the leading event management platform that connects people through amazing events.</p>
            </div>
            
            <div className="about-card card-3">
              <div className="card-icon">⭐</div>
              <h3>Our Values</h3>
              <p>Innovation, reliability, and customer satisfaction drive everything we do.</p>
            </div>
          </div>

          <div className="team-section">
            <h2 className="team-title">Meet Our Amazing Team</h2>
            <p className="team-subtitle">The brilliant minds behind PlanNGo</p>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className={`team-member ${visibleCards.includes(index) ? 'visible' : ''}`}
                  style={{
                    '--member-color': member.color,
                    '--delay': `${index * 0.1}s`
                  }}
                >
                  <div className="member-card">
                    <div className="member-avatar">{member.avatar}</div>
                    <div className="member-info">
                      <h4 className="member-name">{member.name}</h4>
                      <p className="member-role">{member.role}</p>
                    </div>
                    <div className="member-glow"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;