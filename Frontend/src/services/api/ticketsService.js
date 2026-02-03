import apiClient from './client';

export const ticketsService = {
  getAllConfirmedTickets: async () => {
    const response = await apiClient.get('/tickets/confirmed');
    return response.data;
  },
  
  getPriceForTicketType: async (eventId, ticketType) => {
    const response = await apiClient.get('/event-tickets/price', {
      params: { eventId, ticketType }
    });
    return response.data;
  }
};