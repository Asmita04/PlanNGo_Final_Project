import apiClient from './client';

export const paymentService = {
  createRazorpayOrder: async (paymentData) => {
    const response = await apiClient.post('/payments/create-payment-order', paymentData);
    return response.data;
  },
  
  verifyPayment: async (verificationData) => {
    const response = await apiClient.post('/payments/verify-payment', verificationData);
    return response.data;
  }
};