export { authService } from './authService';
export { eventsService } from './eventsService';
export { bookingsService } from './bookingsService';
export { usersService } from './usersService';
export { venuesService } from './venuesService';
export { organizerService } from './organizerService';
export { default as apiClient } from './client';

// Re-export for backward compatibility
import { authService } from './authService';
import { eventsService } from './eventsService';
import { bookingsService } from './bookingsService';
import { usersService } from './usersService';
import { venuesService } from './venuesService';
import { organizerService } from './organizerService';

export const api = {
  // Auth methods
  login: authService.login,
  signup: authService.signup,
  googleLogin: authService.googleLogin,
  googleSignup: (googleUser, additionalData) => authService.googleLogin(googleUser, additionalData),
  logout: authService.logout,
  getCurrentUser: authService.getCurrentUser,
  getToken: authService.getToken,

  // Events methods
  getAllEvents: eventsService.getAllEvents,
  getAllEventsAdmin: eventsService.getAllEventsAdmin,
  getEventById: eventsService.getEventById,
  createEvent: eventsService.createEvent,
  createEventWithUserId: eventsService.createEventWithUserId,
  updateEvent: eventsService.updateEvent,
  deleteEvent: eventsService.deleteEvent,
  getEventsByOrganizer: eventsService.getEventsByOrganizer,
  searchEvents: eventsService.searchEvents,
  getEventsByCategory: eventsService.getEventsByCategory,
  getUpcomingEvents: eventsService.getUpcomingEvents,
  getPopularEvents: eventsService.getPopularEvents,

  // Bookings methods
  createBooking: bookingsService.createBooking,
  getBookingById: bookingsService.getBookingById,
  getUserBookings: bookingsService.getUserBookings,
  getAllBookings: bookingsService.getAllBookings,
  updateBooking: bookingsService.updateBooking,
  cancelBooking: bookingsService.cancelBooking,
  getOrganizerBookings: bookingsService.getOrganizerBookings,

  // Users methods
  getUserProfile: usersService.getUserProfile,
  updateUserProfile: usersService.updateUserProfile,
  getUserById: usersService.getUserById,
  getAllUsers: usersService.getAllUsers,
  deleteUser: usersService.deleteUser,
  updateUserRole: usersService.updateUserRole,

  // Venues methods
  getAllVenues: venuesService.getAllVenues,
 // getAvailableVenues: venuesService.getAvailableVenues,
  getVenueById: venuesService.getVenueById,
  createVenue: venuesService.createVenue,
  updateVenue: venuesService.updateVenue,
  deleteVenue: venuesService.deleteVenue,

  // Organizer methods
  uploadDocuments: organizerService.uploadDocuments,
};