import { useCallback } from 'react';
import { useCitiesStore } from '../store/cities.store';
import { useUIStore } from '../store/ui.store';
import { citiesApi } from '../api/cities.api';

export function useCities() {
  const {
    cities,
    selectedCity,
    filters,
    isLoading,
    error,
    setCities,
    setSelectedCity,
    setFilters,
    setLoading,
    setError
  } = useCitiesStore();

  const { showToast } = useUIStore();

  const fetchCities = useCallback(async (customParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        q: customParams.query !== undefined ? customParams.query : filters.query,
        region: customParams.region !== undefined ? customParams.region : filters.region,
        max_cost: customParams.maxCost !== undefined ? customParams.maxCost : filters.maxCost
      };
      const res = await citiesApi.getCities(params);
      setCities(res.data.cities);
      return res.data.cities;
    } catch (err) {
      const message = err.error || 'Failed to load cities';
      setError(message);
      showToast(message, 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [filters, setCities, setLoading, setError, showToast]);

  return {
    cities,
    selectedCity,
    filters,
    isLoading,
    error,
    fetchCities,
    setSelectedCity,
    setFilters
  };
}
