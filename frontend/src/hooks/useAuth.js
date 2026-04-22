import { create } from 'zustand';
import api from '../utils/api.js';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: true,

  setLoading: (loading) => set({ loading }),

  login: async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token, loading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, loading: false });
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },
}));
