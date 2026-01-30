import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { Mail, Lock, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';
import '../styles/ModernAuth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, addNotification } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    } else if (!/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = "At least one letter required";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "At least one number required";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Check for dummy credentials first
      const dummyCredentials = {
        'user@test.com': { password: 'user123', userRole: 'ROLE_CUSTOMER', name: 'Test User' },
        'organizer@test.com': { password: 'org123', userRole: 'ROLE_ORGANIZER', name: 'Test Organizer' },
        'admin@test.com': { password: 'admin123', userRole: 'ROLE_ADMIN', name: 'Test Admin' }
      };

      const dummyUser = dummyCredentials[formData.email.toLowerCase()];
      
      if (dummyUser && dummyUser.password === formData.password) {
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email: formData.email.toLowerCase(),
          name: dummyUser.name,
          userRole: dummyUser.userRole
        };
        
        login(user);
        addNotification({ message: '✨ Login successful!', type: 'success' });

        // Navigate based on role
        setTimeout(() => {
          if (user.userRole === 'ROLE_ADMIN') {
            navigate('/admin/dashboard');
          } else if (user.userRole === 'ROLE_ORGANIZER') {
            navigate('/organizer/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        }, 300);
        return;
      }

      // If not dummy credentials, try API
      const response = await api.login(formData.email, formData.password);
      login(response.user);
      addNotification({ message: '✨ Login successful!', type: 'success' });

      setTimeout(() => {
        if (response.user.userRole === 'ROLE_ADMIN') {
          navigate('/admin/dashboard');
        } else if (response.user.userRole === 'ROLE_ORGANIZER') {
          navigate('/organizer/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }, 300);

    } catch (error) {
      setErrors({ submit: error.message || 'Invalid email or password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear submit error when user starts typing
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  const fillDemoCredentials = (type) => {
    const credentials = {
      user: { email: 'user@test.com', password: 'user123' },
      organizer: { email: 'organizer@test.com', password: 'org123' },
      admin: { email: 'admin@test.com', password: 'admin123' }
    };
    
    setFormData(credentials[type]);
    setErrors({});
  };

  const handleGoogleSuccess = async (googleResponse) => {
    setLoading(true);
    setErrors({});
    
    try {
      const response = await api.googleLogin({
        idToken: googleResponse.credential,
        userRole: 'ROLE_CUSTOMER'
      });

      login(response.user);
      addNotification({
        message: '✨ Google login successful!',
        type: 'success',
      });

      setTimeout(() => {
        if (response.user.userRole === 'ROLE_ADMIN') {
          navigate('/admin/dashboard');
        } else if (response.user.userRole === 'ROLE_ORGANIZER') {
          navigate('/organizer/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }, 300);

    } catch (error) {
      setErrors({ submit: error.message || 'Google sign-in failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ submit: 'Google sign-in failed. Please try again.' });
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="mesh-overlay"></div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="card-glow"></div>
          
          <div className="login-header">
            <div className="logo-wrapper">
              <div className="logo-circle">
                <Sparkles className="logo-icon" />
              </div>
              <h1>PlanNGo</h1>
            </div>
            <p className="subtitle">Welcome back! Sign in to continue</p>
          </div>

          {errors.submit && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <GoogleSignInButton 
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="Continue with Google"
          />

          <div className="signup-prompt">
            <p>Don't have an account? <Link to="/signup">Create one</Link></p>
          </div>

          <div className="demo-section">
            <div className="demo-header">
              <Sparkles size={16} />
              <h4>Quick Demo Access</h4>
            </div>
            
            <div className="demo-grid">
              <button 
                type="button" 
                className="demo-card user-demo"
                onClick={() => fillDemoCredentials('user')}
              >
                <div className="demo-icon">👤</div>
                <div className="demo-content">
                  <h5>User Demo</h5>
                  <p>user@test.com</p>
                </div>
              </button>
              
              <button 
                type="button" 
                className="demo-card organizer-demo"
                onClick={() => fillDemoCredentials('organizer')}
              >
                <div className="demo-icon">🎪</div>
                <div className="demo-content">
                  <h5>Organizer Demo</h5>
                  <p>organizer@test.com</p>
                </div>
              </button>
              
              <button 
                type="button" 
                className="demo-card admin-demo"
                onClick={() => fillDemoCredentials('admin')}
              >
                <div className="demo-icon">⚡</div>
                <div className="demo-content">
                  <h5>Admin Demo</h5>
                  <p>admin@test.com</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;