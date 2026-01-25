import apiClient from './client';
import { API_ENDPOINTS } from '../../constants';

export const bookingsService = {
  createBooking: async (bookingData) => {
    return await apiClient.post(API_ENDPOINTS.BOOKINGS, bookingData);
  },

  getBookingById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.BOOKING_BY_ID(id));
  },

  getUserBookings: async (userId) => {
    return await apiClient.get(API_ENDPOINTS.USER_BOOKINGS(userId));
  },

  getAllBookings: async () => {
    return await apiClient.get(API_ENDPOINTS.BOOKINGS);
  },

  updateBooking: async (id, bookingData) => {
    return await apiClient.put(API_ENDPOINTS.BOOKING_BY_ID(id), bookingData);
  },

  cancelBooking: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.BOOKING_BY_ID(id));
  },

  getOrganizerBookings: async () => {
    return await apiClient.get(API_ENDPOINTS.ORGANIZER_BOOKINGS);
  },
};