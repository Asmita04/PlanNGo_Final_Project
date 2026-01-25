import apiClient from './client';
import { API_ENDPOINTS } from '../../constants';

export const venuesService = {
  // Get all venues
  getAllVenues: async () => {
    return await apiClient.get(API_ENDPOINTS.VENUES);
  },

  // Get available venues only
  getAvailableVenues: async () => {
    return await apiClient.get(API_ENDPOINTS.AVAILABLE_VENUES);
  },

  // Get venue by ID
  getVenueById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.VENUE_BY_ID(id));
  },

  // Create new venue (Admin only)
  createVenue: async (venueData) => {
    return await apiClient.post(API_ENDPOINTS.VENUES, venueData);
  },

  // Update venue (Admin only)
  updateVenue: async (id, venueData) => {
    return await apiClient.put(API_ENDPOINTS.VENUE_BY_ID(id), venueData);
  },

  // Delete venue (Admin only)
  deleteVenue: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.VENUE_BY_ID(id));
  }
};