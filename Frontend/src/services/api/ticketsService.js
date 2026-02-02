import apiClient from './client';

export const ticketsService = {
  getAllConfirmedTickets: async () => {
    const response = await apiClient.get('/tickets/confirmed');
    return response.data;
  },
  
  getPriceForTicketType: async (ticketType) => {
    const response = await apiClient.get(`/tickets/price/${ticketType}`);
    return response.data;
  }
};