import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider, useApp } from './context/AppContext';
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
import OrganizerVerification from './components/OrganizerVerification';
import EventManagement from './pages/EventManagement';
import VenueManagement from './pages/VenueManagement';
import UserManagement from './pages/UserManagement';
import NotFound from './pages/NotFound';
import './styles/GlobalTheme.css';

// Protected Login/Signup Route Component
const AuthRoute = ({ children }) => {
  const { user } = useApp();
  
  if (user) {
    // Redirect logged-in users to their dashboard
    if (user.userRole === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.userRole === 'ROLE_ORGANIZER') return <Navigate to="/organizer/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }
  
  return children;
};

// Admin Events Protection
const AdminEventsRoute = ({ children }) => {
  const { user } = useApp();
  
  if (user && user.userRole === 'ROLE_ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};
const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
        <Route path="/events" element={<AdminEventsRoute><Events /></AdminEventsRoute>} />
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
          path="/admin/organizers" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <OrganizerVerification />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/event-management" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <EventManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/venue-management" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <VenueManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/user-management" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <UserManagement />
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
        <Route path="*" element={<NotFound />} />
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
