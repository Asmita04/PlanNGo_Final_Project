import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { Mail, Lock, User, Phone, AlertCircle, Eye, EyeOff, Sparkles, Zap } from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const { login, addNotification } = useApp();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userRole: 'ROLE_CUSTOMER'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    if (!formData.email)
      newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email';

    if (!formData.password)
      newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Minimum 6 characters';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.phone)
      newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = 'Invalid phone number';

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
      const { confirmPassword, ...signupData } = formData;
      const response = await api.signup(signupData);

      addNotification({ message: 'Account created successfully! Please login. 🎉', type: 'success' });
      navigate('/login');
    } catch (error) {
      setErrors({ submit: error.message || 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleResponse) => {
    setLoading(true);
    try {
      const response = await api.googleSignup({
        idToken: googleResponse.credential,
        userRole: formData.userRole
      });

      login(response.user);
      addNotification({ message: 'Google signup successful! 🎉', type: 'success' });

      response.user.userRole === 'ROLE_ORGANIZER'
        ? navigate('/organizer/dashboard')
        : navigate('/user/dashboard');

    } catch (error) {
      setErrors({ submit: error.message || 'Google signup failed ❌' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ submit: 'Google sign-up failed. Try again.' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-pattern"></div>
      </div>
      
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <div className="logo-section">
              <div className="logo-icon">
                <span className="icon-ticket">🎫</span>
                <div className="sparkle sparkle-1">✨</div>
                <div className="sparkle sparkle-2">✨</div>
              </div>
              <h1>Join PlanNGo</h1>
            </div>
            <p>Create your account and start planning amazing events</p>
          </div>

          {errors.submit && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="name-row">
              <div className="input-group">
                <label className="input-label">First Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                </div>
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>
              
              <div className="input-group">
                <label className="input-label">Last Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                </div>
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                />
              </div>
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>

            <div className="role-section">
              <label className="section-label">
                <Sparkles size={16} />
                Choose your role
              </label>
              <div className="role-cards">
                <div 
                  className={`role-card ${formData.userRole === 'ROLE_CUSTOMER' ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, userRole: 'ROLE_CUSTOMER'})}
                >
                  <input
                    type="radio"
                    name="userRole"
                    value="ROLE_CUSTOMER"
                    checked={formData.userRole === 'ROLE_CUSTOMER'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <div className="role-icon">🎫</div>
                    <div className="role-text">
                      <div className="role-title">Event Attendee</div>
                      <div className="role-desc">Discover and book amazing events</div>
                    </div>
                  </div>
                  <div className="role-check">✓</div>
                </div>
                
                <div 
                  className={`role-card ${formData.userRole === 'ROLE_ORGANIZER' ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, userRole: 'ROLE_ORGANIZER'})}
                >
                  <input
                    type="radio"
                    name="userRole"
                    value="ROLE_ORGANIZER"
                    checked={formData.userRole === 'ROLE_ORGANIZER'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <div className="role-icon">🎪</div>
                    <div className="role-text">
                      <div className="role-title">Event Organizer</div>
                      <div className="role-desc">Create and manage your events</div>
                    </div>
                  </div>
                  <div className="role-check">✓</div>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Create Account
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
            text="Sign up with Google"
          />

          <div className="signup-footer">
            <p>Already have an account? <Link to="/login" className="login-link">Sign In</Link></p>
            <p className="terms-text">
              By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;