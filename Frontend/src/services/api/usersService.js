import apiClient from './client';
import { API_ENDPOINTS } from '../../constants';

export const usersService = {
  getUserProfile: async () => {
    return await apiClient.get(API_ENDPOINTS.USER_PROFILE);
  },

  updateUserProfile: async (userData) => {
    return await apiClient.put(API_ENDPOINTS.USER_PROFILE, userData);
  },

  getUserById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.USER_BY_ID(id));
  },

  getAllUsers: async () => {
    return await apiClient.get(API_ENDPOINTS.USERS);
  },

  deleteUser: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.USER_BY_ID(id));
  },

  updateUserRole: async (id, role) => {
    return await apiClient.put(API_ENDPOINTS.USER_BY_ID(id), { role });
  },
};