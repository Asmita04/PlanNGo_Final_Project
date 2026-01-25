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
      const response = await api.login(formData.email, formData.password);
      login(response.user);
      addNotification({ message: 'Login successful!', type: 'success' });

      if (response.user.role === 'admin') navigate('/admin/dashboard');
      else if (response.user.role === 'organizer') navigate('/organizer/dashboard');
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

  const handleGoogleSuccess = async (googleResponse) => {
  setLoading(true);
  try {
    // ✅ Send ONLY the ID token
    const response = await api.googleLogin({
      idToken: googleResponse.credential,
      role: formData.role || 'Client' // default to 'user' role
    });

    login(response.user);
    addNotification({
      message: 'Google login successful!',
      type: 'success',
    });

    if (response.user.role === 'admin') navigate('/admin/dashboard');
    else if (response.user.role === 'organizer') navigate('/organizer/dashboard');
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
            <h4>Demo Credentials:</h4>
            <p><strong>User:</strong> user@test.com / user123</p>
            <p><strong>Organizer:</strong> organizer@test.com / org123</p>
            <p><strong>Admin:</strong> admin@test.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
