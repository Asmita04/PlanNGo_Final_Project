import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { Mail, Lock, User, Phone, AlertCircle, Eye, EyeOff } from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';
import './Auth.css';
import '../styles/ModernAuth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { login, addNotification } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'client'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =======================
  // FORM VALIDATION
  // =======================
  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';

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

    if (!formData.phoneNumber)
      newErrors.phoneNumber = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = 'Invalid phone number';

    return newErrors;
  };

  // =======================
  // NORMAL SIGNUP
  // =======================
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

      // On successful signup, redirect to login with success message
      addNotification({ message: 'Account created successfully! Please login. 🎉', type: 'success' });
      navigate('/login');
    } catch (error) {
      setErrors({ submit: error.message || 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // GOOGLE SIGNUP (FIXED) ✅
  // =======================
  const handleGoogleSuccess = async (googleResponse) => {
    setLoading(true);
    try {
      const response = await api.googleSignup({
        idToken: googleResponse.credential, // ✅ JWT STRING
        role: formData.role
      });

      login(response.user);
      addNotification({ message: 'Google signup successful! 🎉', type: 'success' });

      response.user.role === 'organizer'
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
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // =======================
  // UI
  // =======================
  return (
    <div className="modern-auth-page">
      <div className="modern-auth-card">

        <h1>Create Account</h1>

        {errors.submit && (
          <div className="modern-error">
            <AlertCircle size={16} />
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input name="name" placeholder="Full Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="phoneNumber" placeholder="Phone" onChange={handleChange} />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
          />

          <div className="role-buttons">
            <button
              type="button"
              className={`role-btn ${formData.role === 'client' ? 'selected' : ''}`}
              onClick={() => setFormData({...formData, role: 'client'})}
            >
              🎫 Join Events
            </button>

            <button
              type="button"
              className={`role-btn ${formData.role === 'organizer' ? 'selected' : ''}`}
              onClick={() => setFormData({...formData, role: 'organizer'})}
            >
              🎪 Host Events
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="divider">OR</div>

        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
