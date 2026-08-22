import api from './client';

export const budgetApi = {
  getTripBudget: (tripId) => api.get(`/trips/${tripId}/budget`),
  logExpense: (tripId, expenseData) => api.post(`/trips/${tripId}/expenses`, expenseData),
  deleteExpense: (expenseId) => api.delete(`/expenses/${expenseId}`)
};
