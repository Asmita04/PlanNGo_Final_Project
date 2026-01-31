import apiClient from './client';
import { API_ENDPOINTS } from '../../constants';

export const usersService = {
  getUserProfile: async () => {
    return await apiClient.get(API_ENDPOINTS.USER_PROFILE);
  },

  updateUserProfile: async (userId, userData) => {
    const processedData = {
      ...userData.user,
      dob: userData.user.dob === '' ? null : userData.user.dob,
      pfp: userData.user.pfp || null
    };
    console.log("Sending userData to backend:", processedData);
    return await apiClient.put(`/customer/profile/${userId}`, processedData);
  },

  getUserById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.USER_BY_ID(id));
  },

  getAllUsers: async () => {
    return await apiClient.get(API_ENDPOINTS.ADMIN_USERS);
  },

  deleteUser: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.USER_BY_ID(id));
  },

  updateUserRole: async (id, role) => {
    return await apiClient.put(API_ENDPOINTS.USER_BY_ID(id), { role });
  },
};