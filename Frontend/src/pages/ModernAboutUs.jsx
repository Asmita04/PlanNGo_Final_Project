import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Target, Heart, Users, Zap, 
  Award, Globe, Rocket, Star,
  ArrowRight, Play
} from 'lucide-react';
import './ModernAboutUs.css';

const AboutUs = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  const [typedText, setTypedText] = useState('');
  const fullText = 'Connecting People Through Unforgettable Experiences';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  const values = [
    {
      icon: <Heart size={40} />,
      title: 'Passion',
      description: 'We are passionate about creating meaningful connections through events',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: <Users size={40} />,
      title: 'Community',
      description: 'Building strong communities one event at a time',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Zap size={40} />,
      title: 'Innovation',
      description: 'Constantly innovating to improve the event experience',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Award size={40} />,
      title: 'Excellence',
      description: 'Committed to delivering excellence in every interaction',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const timeline = [
    { year: '2020', title: 'The Beginning', description: 'PlanNGo was founded with a vision to revolutionize event management' },
    { year: '2021', title: 'First Milestone', description: 'Reached 1,000 events and 10,000 users on our platform' },
    { year: '2022', title: 'Global Expansion', description: 'Expanded to 15 countries and launched mobile apps' },
    { year: '2023', title: 'Innovation Leader', description: 'Introduced AI-powered event recommendations and virtual events' },
    { year: '2024', title: 'Future Vision', description: 'Leading the industry with cutting-edge technology and user experience' }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '/api/placeholder/300/300',
      bio: 'Visionary leader with 15+ years in event management'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: '/api/placeholder/300/300',
      bio: 'Tech innovator passionate about scalable solutions'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Design',
      image: '/api/placeholder/300/300',
      bio: 'Creative designer focused on user-centered experiences'
    },
    {
      name: 'David Kim',
      role: 'VP of Operations',
      image: '/api/placeholder/300/300',
      bio: 'Operations expert ensuring seamless event experiences'
    }
  ];

  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-background"
          style={{ y }}
        />
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <h1>About PlanNGo</h1>
            <div className="typed-text">
              {typedText}
              <span className="cursor">|</span>
            </div>
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              Watch Our Story
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mission-vision-grid">
            <motion.div
              className="mission-card glassmorphism"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="card-icon">
                <Target size={48} />
              </div>
              <h3>Our Mission</h3>
              <p>
                To democratize event management by providing innovative, 
                user-friendly tools that connect people and create 
                unforgettable experiences worldwide.
              </p>
            </motion.div>

            <motion.div
              className="vision-card glassmorphism"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="card-icon">
                <Rocket size={48} />
              </div>
              <h3>Our Vision</h3>
              <p>
                To be the world's leading platform where every event, 
                big or small, becomes a catalyst for meaningful 
                connections and lasting memories.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </motion.div>

          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="value-card glassmorphism"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className={`value-icon bg-gradient-to-r ${value.color}`}>
                  {value.icon}
                </div>
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Our Journey</h2>
            <p>Milestones that shaped our story</p>
          </motion.div>

          <div className="timeline">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className="timeline-item"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="timeline-content glassmorphism">
                  <div className="timeline-year">{item.year}</div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
                <div className="timeline-dot" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Meet Our Team</h2>
            <p>The passionate people behind PlanNGo</p>
          </motion.div>

          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="team-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                  <div className="team-overlay">
                    <div className="social-links">
                      <a href="#"><Globe size={20} /></a>
                      <a href="#"><Star size={20} /></a>
                    </div>
                  </div>
                </div>
                <div className="team-info">
                  <h4>{member.name}</h4>
                  <p className="role">{member.role}</p>
                  <p className="bio">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Create Amazing Events?</h2>
            <p>Join thousands of event organizers who trust PlanNGo</p>
            <motion.button
              className="cta-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;