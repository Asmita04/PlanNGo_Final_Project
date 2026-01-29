import apiClient from './client';
import { API_ENDPOINTS } from '../../constants';

export const venuesService = {
  getAllVenues: async () => {
    return await apiClient.get(API_ENDPOINTS.VENUES);
  },

  getAvailableVenues: async () => {
    return await apiClient.get(API_ENDPOINTS.AVAILABLE_VENUES);
  },

  getVenueById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.VENUE_BY_ID(id));
  },

  createVenue: async (venueData) => {
    return await apiClient.post(API_ENDPOINTS.CREATE_VENUE, venueData);
  },

  updateVenue: async (id, venueData) => {
    return await apiClient.put(API_ENDPOINTS.VENUE_BY_ID(id), venueData);
  },

  deleteVenue: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.VENUE_BY_ID(id));
  }
};
