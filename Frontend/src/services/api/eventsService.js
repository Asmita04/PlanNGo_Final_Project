import apiClient from './client';
import { API_ENDPOINTS } from '../../constants';
import axios from 'axios';

export const eventsService = {
  getAllEvents: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${API_ENDPOINTS.EVENTS}?${queryParams}` : API_ENDPOINTS.EVENTS;
    return await apiClient.get(url);
  },

  getAllEventsAdmin: async () => {
    return await apiClient.get(API_ENDPOINTS.ADMIN_EVENTS);
  },

  getEventById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.EVENT_BY_ID(id));
  },

  createEvent: async (eventData) => {
    return await apiClient.post(API_ENDPOINTS.EVENTS, eventData);
  },

  createEventWithUserId: async (userId, formData) => {
    return await axios.post(`http://localhost:9090/events/register/${userId}`, formData);
  },


  updateEvent: async (id, eventData) => {
    return await apiClient.put(API_ENDPOINTS.EVENT_BY_ID(id), eventData);
  },

  deleteEvent: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.EVENT_BY_ID(id));
  },

  getEventsByOrganizer: async (organizerId) => {
    return await apiClient.get(API_ENDPOINTS.EVENTS_BY_ORGANIZER(organizerId));
  },

  searchEvents: async (searchTerm, filters = {}) => {
    const params = {
      search: searchTerm,
      ...filters,
    };
    return await eventsService.getAllEvents(params);
  },

  getEventsByCategory: async (category) => {
    return await eventsService.getAllEvents({ category });
  },

  getUpcomingEvents: async () => {
    return await eventsService.getAllEvents({ upcoming: true });
  },

  getPopularEvents: async () => {
    return await eventsService.getAllEvents({ popular: true });
  },
};