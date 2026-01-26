import apiClient from './client';
import { API_ENDPOINTS } from '../../constants';

export const authService = {
  login: async (email, password) => {
    console.log("Payload sent to backend:", { email, password });
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    
    if (response.token && response.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      if (response.user.userRole) {
        localStorage.setItem('userRole', response.user.userRole);
      }
    }
    
    return response;
  },

  signup: async (userData) => {
    console.log("Payload sent to backend:", userData);
    const response = await apiClient.post(API_ENDPOINTS.SIGNUP, userData);
    
    // Don't auto-login on signup, just return response
    // User will be redirected to login page with success message
    return response;
  },

  googleLogin: async (googleUser, additionalData = {}) => {
    
    var idToken=googleUser.idToken;
    var userRole=googleUser.userRole || additionalData.userRole;
    console.log("Payload sent to backend:", { idToken, userRole });
    const response = await apiClient.post(API_ENDPOINTS.GOOGLE_LOGIN, {
      idToken,   // ✅ STRING
      userRole
      
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('userRole', response.user.userRole);
    }
    
    return response;
  },



  
googleSignup: async ({ idToken, userRole }) => {
  console.log("Payload sent to backend:", {
    idToken,
    userRole
  });

  const response = await apiClient.post(
    API_ENDPOINTS.GOOGLE_LOGIN,
    {
      idToken,   // ✅ STRING
      userRole
    }
  );

  if (response.token && response.user) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    if (response.user.userRole) {
      localStorage.setItem('userRole', response.user.userRole);
    }
  }
  console.log("Response from backend:", response);
  return response;
},

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};