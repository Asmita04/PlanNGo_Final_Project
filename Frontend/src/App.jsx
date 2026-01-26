import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import ClientProfile from './pages/ClientProfile';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Review from './pages/Review';
import Booking from './pages/Booking';
import UserDashboard from './pages/UserDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerProfile from './pages/OrganizerProfile';
import AdminDashboard from './pages/AdminDashboard';
import ModernAdminDashboard from './pages/ModernAdminDashboard';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import EventApproval from './components/EventApproval';
import OrganizerVerification from './components/OrganizerVerification';
import './styles/GlobalTheme.css';

// App Routes Component
const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/events/:id/book"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admin/modern" element={<ModernAdminDashboard />} />
        <Route 
          path="/admin/events" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <EventApproval />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/organizers" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <OrganizerVerification />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
              <ClientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ORGANIZER']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/profile"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ORGANIZER']}>
              <OrganizerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// Main App Component
function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
