import { useCallback } from 'react';
import { useBudgetStore } from '../store/budget.store';
import { useUIStore } from '../store/ui.store';
import { budgetApi } from '../api/budget.api';

export function useBudget(tripId) {
  const {
    budgetData,
    isLoading,
    error,
    setBudgetData,
    setLoading,
    setError
  } = useBudgetStore();

  const { showToast } = useUIStore();

  const fetchBudget = useCallback(async () => {
    if (!tripId) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await budgetApi.getTripBudget(tripId);
      setBudgetData(res.data.budget);
      return res.data.budget;
    } catch (err) {
      const message = err.error || 'Failed to fetch budget breakdown';
      setError(message);
      showToast(message, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [tripId, setBudgetData, setLoading, setError, showToast]);

  const addExpense = useCallback(async (expenseData) => {
    setLoading(true);
    try {
      await budgetApi.logExpense(tripId, expenseData);
      showToast('Expense added.', 'success');
      // Refetch whole budget to update aggregations
      return fetchBudget();
    } catch (err) {
      const message = err.error || 'Failed to add expense';
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tripId, fetchBudget, setLoading, showToast]);

  const deleteExpense = useCallback(async (expenseId) => {
    setLoading(true);
    try {
      await budgetApi.deleteExpense(expenseId);
      showToast('Expense removed.', 'info');
      return fetchBudget();
    } catch (err) {
      const message = err.error || 'Failed to delete expense';
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBudget, setLoading, showToast]);

  return {
    budgetData,
    isLoading,
    error,
    fetchBudget,
    addExpense,
    deleteExpense
  };
}
