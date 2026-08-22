import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useUIStore } from '../store/ui.store';
import { authApi } from '../api/auth.api';

export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error, setUser, setAuthData, logout: storeLogout, setLoading, setError } = useAuthStore();
  const { showToast } = useUIStore();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      const { user, access_token, refresh_token } = res.data;
      setAuthData(user, access_token, refresh_token);
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate('/dashboard');
      return user;
    } catch (err) {
      const message = err.error || 'Failed to login. Please check your credentials.';
      setError(message);
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, setAuthData, setLoading, setError, showToast]);

  const register = useCallback(async (name, email, password, avatar_url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register({ name, email, password, avatar_url });
      const { user, access_token, refresh_token } = res.data;
      setAuthData(user, access_token, refresh_token);
      showToast(`Account created! Welcome to GlobeTrotter, ${user.name}.`, 'success');
      navigate('/dashboard');
      return user;
    } catch (err) {
      const message = err.error || 'Registration failed. Please try again.';
      setError(message);
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, setAuthData, setLoading, setError, showToast]);

  const loginWithGoogle = useCallback(async (email, name, avatar_url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.googleAuth({ email, name, avatar_url });
      const { user, access_token, refresh_token } = res.data;
      setAuthData(user, access_token, refresh_token);
      showToast(`Signed in with Google as ${user.name}!`, 'success');
      navigate('/dashboard');
      return user;
    } catch (err) {
      const message = err.error || 'Google authentication failed.';
      setError(message);
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, setAuthData, setLoading, setError, showToast]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore API logout error
    } finally {
      storeLogout();
      showToast('You have been logged out.', 'info');
      navigate('/auth/login');
    }
  }, [navigate, storeLogout, showToast]);

  const updateProfile = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await authApi.updateProfile(data);
      const updated = res.data.user;
      setUser(updated);
      showToast('Profile updated successfully.', 'success');
      return updated;
    } catch (err) {
      const message = err.error || 'Failed to update profile';
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, showToast]);

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isLoading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile
  };
}
