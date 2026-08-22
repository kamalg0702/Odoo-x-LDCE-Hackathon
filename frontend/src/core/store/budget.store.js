import { create } from 'zustand';

export const useBudgetStore = create((set) => ({
  budgetData: null,
  isLoading: false,
  error: null,

  setBudgetData: (budgetData) => set({ budgetData }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));
