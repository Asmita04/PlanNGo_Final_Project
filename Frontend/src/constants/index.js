export const API_BASE_URL = 'http://localhost:9090';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/users/signin',
  SIGNUP: '/users/signup',
  GOOGLE_LOGIN: '/Auth/google',
 
  // Venues endpoints
  VENUES: '/venues',
  VENUE_BY_ID: (id) => `/venues/${id}`,
  AVAILABLE_VENUES: '/venues/available',
  CREATE_VENUE: '/venues/register',

  
  // Events endpoints
  EVENTS: '/event/events',
  EVENT_BY_ID: (id) => `/event/${id}`,
  EVENTS_BY_ORGANIZER: (organizerId) => `/event/register/${organizerId}`,
  
  // Bookings endpoints
  BOOKINGS: '/bookings',
  BOOKING_BY_ID: (id) => `/bookings/${id}`,
  USER_BOOKINGS: (userId) => `/bookings/user/${userId}`,
  
  // Users endpoints
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  USER_PROFILE: '/users/profile',
  
  // Admin endpoints
  ADMIN_EVENTS: '/admin/events',
  ADMIN_USERS: '/admin/users',
  ADMIN_BOOKINGS: '/admin/bookings',
  
  // Organizer endpoints
  ORGANIZER_PROFILE: '/organizer/profile',
  ORGANIZER_EVENTS: '/organizer/events',
  ORGANIZER_BOOKINGS: '/organizer/bookings',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const EVENT_CATEGORIES = [
  'Technology',
  'Music',
  'Art',
  'Food',
  'Business',
  'Sports',
  'Education',
  'Entertainment',
  'Health',
  'Travel'
];

export const EVENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

export const USER_ROLES = {
  CUSTOMER: 'ROLE_CUSTOMER',
  ORGANIZER: 'ROLE_ORGANIZER',
  ADMIN: 'ROLE_ADMIN'
};