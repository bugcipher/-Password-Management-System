import axios from 'axios';

// Create Axios Instance with default settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject JWT authentication token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authService = {
  login: async (email, master_password) => {
    const response = await api.post('/auth/login', { email, master_password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (username, email, master_password) => {
    const response = await api.post('/auth/register', { username, email, master_password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Password Manager Endpoints
export const passwordService = {
  getAll: async () => {
    const response = await api.get('/passwords');
    return response.data;
  },
  add: async (website_name, website_url, login_username, password) => {
    const response = await api.post('/passwords', {
      website_name,
      website_url,
      login_username,
      password
    });
    return response.data;
  },
  decrypt: async (id) => {
    const response = await api.get(`/passwords/${id}/decrypt`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/passwords/${id}`);
    return response.data;
  },
  getAuditLogs: async () => {
    const response = await api.get('/passwords/audit-logs');
    return response.data;
  }
};

export default api;
