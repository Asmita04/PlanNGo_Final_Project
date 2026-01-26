import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import GoogleSignInButton from '../components/GoogleSignInButton';
import './Auth.css';
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

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!/.{6,}/.test(formData.password)) {
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
    try {
      // Check for dummy credentials first
      const dummyCredentials = {
        'user@test.com': { password: 'user123', userRole: 'ROLE_CUSTOMER', name: 'Test User' },
        'organizer@test.com': { password: 'org123', userRole: 'ROLE_ORGANIZER', name: 'Test Organizer' },
        'admin@test.com': { password: 'admin123', userRole: 'ROLE_ADMIN', name: 'Test Admin' }
      };

      const dummyUser = dummyCredentials[formData.email];
      if (dummyUser && dummyUser.password === formData.password) {
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email: formData.email,
          name: dummyUser.name,
          userRole: dummyUser.userRole
        };
        
        login(user);
        addNotification({ message: 'Login successful!', type: 'success' });

        if (user.userRole === 'ROLE_ADMIN') navigate('/admin/dashboard');
        else if (user.userRole === 'ROLE_ORGANIZER') navigate('/organizer/dashboard');
        else navigate('/user/dashboard');
        return;
      }

      // If not dummy credentials, try API
      const response = await api.login(formData.email, formData.password);
      login(response.user);
      addNotification({ message: 'Login successful!', type: 'success' });

      if (response.user.userRole === 'ROLE_ADMIN') navigate('/admin/dashboard');
      else if (response.user.userRole === 'ROLE_ORGANIZER') navigate('/organizer/dashboard');
      else navigate('/user/dashboard');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
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
  try {
    // ✅ Send ONLY the ID token
    const response = await api.googleLogin({
      idToken: googleResponse.credential,
      userRole: 'ROLE_CUSTOMER' // default role
    });

    login(response.user);
    addNotification({
      message: 'Google login successful!',
      type: 'success',
    });

    if (response.user.userRole === 'ROLE_ADMIN') navigate('/admin/dashboard');
    else if (response.user.userRole === 'ROLE_ORGANIZER') navigate('/organizer/dashboard');
    else navigate('/user/dashboard');

  } catch (error) {
    setErrors({ submit: error.message });
  } finally {
    setLoading(false);
  }
};

  const handleGoogleError = (error) => {
    setErrors({ submit: 'Google sign-in failed. Please try again.' });
  };

  return (
    <div className="modern-auth-page">
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="modern-auth-container">
        <div className="modern-auth-card">
          <div className="modern-header">
            <div className="logo-section">
              <div className="logo-icon">🎫</div>
              <h1>Welcome Back</h1>
            </div>
            <p>Login to your PlanNGo account</p>
          </div>

          {errors.submit && (
            <div className="modern-error">
              <AlertCircle size={16} />
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-group">
              <div className="modern-input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`modern-input ${errors.email ? 'error' : ''}`}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <div className="modern-input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`modern-input ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <button type="submit" className="modern-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Logging in...
                </>
              ) : (
                'Login'
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

          <div className="modern-footer">
            <p>Don't have an account? <Link to="/signup" className="login-link">Sign Up</Link></p>
          </div>

          <div className="demo-credentials">
            <h4>🚀 Quick Demo Login:</h4>
            <div className="demo-buttons">
              <button 
                type="button" 
                className="demo-btn user"
                onClick={() => fillDemoCredentials('user')}
              >
                👤 User Login
              </button>
              <button 
                type="button" 
                className="demo-btn organizer"
                onClick={() => fillDemoCredentials('organizer')}
              >
                🎪 Organizer Login
              </button>
              <button 
                type="button" 
                className="demo-btn admin"
                onClick={() => fillDemoCredentials('admin')}
              >
                ⚡ Admin Login
              </button>
            </div>
            <div className="demo-info">
              <p><strong>User:</strong> user@test.com / user123</p>
              <p><strong>Organizer:</strong> organizer@test.com / org123</p>
              <p><strong>Admin:</strong> admin@test.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
